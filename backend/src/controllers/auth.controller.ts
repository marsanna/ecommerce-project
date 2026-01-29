import { ACCESS_JWT_SECRET, REFRESH_TOKEN_TTL } from "#config";
import { RefreshToken, User } from "#models";
import { createAccessToken, createRefreshToken, hashPassword } from "#utils";
import bcrypt from "bcrypt";
import type { RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";

function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
) {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: REFRESH_TOKEN_TTL * 1000,
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
}

export const register: RequestHandler = async (req, res) => {
  const { firstName, lastName, email, password, roles } = req.body;
  const userExists = await User.exists({ email });
  if (userExists)
    throw new Error("Email already exists", { cause: { status: 400 } });

  const hashedPassword = await hashPassword(password);

  const newUser = await User.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    roles,
  });

  const accessToken = await createAccessToken({
    id: newUser.id,
    roles: newUser.roles,
  });

  const refreshToken = await createRefreshToken(newUser.id);

  setAuthCookies(res, accessToken, refreshToken);

  res.status(201).json({ message: "Registered" });
};

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new Error(" User not found", { cause: { status: 404 } });

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) throw new Error("Incorrect credentials");

  const accessToken = await createAccessToken({
    id: user.id,
    roles: user.roles,
  });
  const refreshToken = await createRefreshToken(user.id);

  setAuthCookies(res, accessToken, refreshToken);

  res.status(200).json({ message: "Logged in" });
};

export const refresh: RequestHandler = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken)
    throw new Error("Refresh token is required", {
      cause: { status: 401 },
    });

  const storedToken = await RefreshToken.findOne({ token: refreshToken });
  if (!storedToken)
    throw new Error("Refresh token not found", {
      cause: { status: 401 },
    });

  await RefreshToken.findByIdAndDelete(storedToken.id);

  const user = await User.findById(storedToken.userId);
  if (!user) throw new Error("User not found", { cause: { status: 404 } });

  const newAccessToken = await createAccessToken({
    id: user.id,
    roles: user.roles,
  });
  const newRefreshToken = await createRefreshToken(user.id);

  setAuthCookies(res, newAccessToken, newRefreshToken);

  res.status(200).json({ message: "Refreshed" });
};

export const logout: RequestHandler = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    await RefreshToken.findOneAndDelete({ token: refreshToken });
  }

  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");

  res.status(200).json({ message: "Logged out" });
};

export const me: RequestHandler = async (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken)
    throw new Error("Acces token is required", {
      cause: { status: 401 },
    });

  try {
    const decoded = jwt.verify(
      accessToken,
      ACCESS_JWT_SECRET,
    ) as jwt.JwtPayload;
    if (!decoded.sub)
      throw new Error("Invalid access token", { cause: { status: 401 } });

    const user = await User.findById(decoded.sub);
    if (!user) throw new Error("User not found", { cause: { status: 404 } });

    res.status(200).json({ message: "Valid token", user });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(
        new Error("Expired access token", {
          cause: { status: 401, code: "ACCESS_TOKEN_EXPIRED" },
        }),
      );
    }

    return next(new Error("Invalid access token", { cause: { status: 401 } }));
  }
};
