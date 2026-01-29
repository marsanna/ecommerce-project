import { ACCESS_JWT_SECRET, SALT_ROUNDS } from '#config';
import bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { RefreshToken } from '#models';

export async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function createAccessToken(payload: { id: Types.ObjectId; roles: string[] }) {
  return jwt.sign({ sub: payload.id, roles: payload.roles }, ACCESS_JWT_SECRET, {
    expiresIn: '15min'
  });
}

export async function createRefreshToken(id: Types.ObjectId) {
  const refreshToken = crypto.randomBytes(25).toString('hex');

  await RefreshToken.create({ token: refreshToken, userId: id });

  return refreshToken;
}
