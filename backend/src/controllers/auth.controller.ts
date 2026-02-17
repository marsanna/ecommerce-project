import { ACCESS_JWT_SECRET, REFRESH_TOKEN_TTL } from "#config";
import { RefreshToken, User } from "#models";
import { loginSchema, registerSchema } from "#schemas";
import { createAccessToken, createRefreshToken, hashPassword } from "#utils";
import bcrypt from "bcrypt";
import type { RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";

function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
) {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "strict",
    ...(isProduction ? { partitioned: true } : {}),
    maxAge: REFRESH_TOKEN_TTL * 1000,
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "strict",
    ...(isProduction ? { partitioned: true } : {}),
  });
}

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     description: Register a new user and set auth cookies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         headers:
 *           Set-Cookie:
 *             description: Access and refresh tokens as httpOnly cookies
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Registered
 *       400:
 *         description: Email already exists or validation error
 */

export const register: RequestHandler = async (req, res) => {
  const validatedData = registerSchema.parse(req.body);
  const { email, password, firstName, lastName, roles } = validatedData;

  const userExists = await User.exists({ email });
  if (userExists)
    throw new Error("Email already exists.", { cause: { status: 400 } });

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

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     description: Login user and set auth cookies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Logged in successfully
 *         headers:
 *           Set-Cookie:
 *             description: Access and refresh tokens as httpOnly cookies
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged in
 *       401:
 *         description: Incorrect credentials
 *       404:
 *         description: User not found
 */

export const login: RequestHandler = async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

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

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     tags:
 *       - Auth
 *     description: Refresh access token using refresh token cookie
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully
 *         headers:
 *           Set-Cookie:
 *             description: New access and refresh tokens
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Refreshed
 *       401:
 *         description: Refresh token missing, invalid or expired
 *       404:
 *         description: User not found
 */

export const refresh: RequestHandler = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken)
    throw new Error("Refresh token is required", {
      cause: { status: 401 },
    });

  const storedToken = await RefreshToken.findOne({ token: refreshToken });
  if (!storedToken)
    throw new Error("Refresh token not found.", {
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

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     description: Logout user and clear auth cookies
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out
 */

export const logout: RequestHandler = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    await RefreshToken.findOneAndDelete({ token: refreshToken });
  }

  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? ("none" as const) : ("strict" as const),
    ...(isProduction ? { partitioned: true } : {}),
  };

  res.clearCookie("refreshToken", cookieOptions);
  res.clearCookie("accessToken", cookieOptions);

  res.status(200).json({ message: "Logged out" });
};

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     description: Get current authenticated user from access token cookie
 *     responses:
 *       200:
 *         description: Valid access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Valid token
 *                 user:
 *                   $ref: '#/components/schemas/UserOutput'
 *       401:
 *         description: Missing, invalid or expired access token
 *       404:
 *         description: User not found
 */

export const me: RequestHandler = async (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken)
    throw new Error("Access token is required.", {
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
