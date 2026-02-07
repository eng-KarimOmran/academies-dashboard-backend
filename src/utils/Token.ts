import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import env from "../config/env";

export enum TokenType {
  ACCESS = "ACCESS",
  REFRESH = "REFRESH",
}

export interface ITokenPayload {
  id: string;
  iat: number;
  exp: number;
  jti: string;
}

export class Token {
  static generateTokens(userId: string) {
    const {
      ACCESS_EXPIRATION,
      ACCESS_SECRET,
      REFRESH_EXPIRATION,
      REFRESH_SECRET,
    } = env.token;
    const jti = nanoid();

    const access = jwt.sign({ id: userId }, ACCESS_SECRET, {
      expiresIn: ACCESS_EXPIRATION,
      jwtid: jti,
    });

    const refresh = jwt.sign({ id: userId }, REFRESH_SECRET, {
      expiresIn: REFRESH_EXPIRATION,
      jwtid: jti,
    });
    return { access, refresh };
  }

  static verifyToken(token: string, type: TokenType): ITokenPayload | null {
    const { ACCESS_SECRET, REFRESH_SECRET } = env.token;
    const secret = type === "ACCESS" ? ACCESS_SECRET : REFRESH_SECRET;
    try {
      return jwt.verify(token, secret) as ITokenPayload;
    } catch (error) {
      return null;
    }
  }

  static generateAccessToken(userId: string, jti: string) {
    const { ACCESS_SECRET, ACCESS_EXPIRATION } = env.token;
    const access = jwt.sign({ id: userId }, ACCESS_SECRET, {
      expiresIn: ACCESS_EXPIRATION,
      jwtid: jti,
    });
    return access;
  }
}
