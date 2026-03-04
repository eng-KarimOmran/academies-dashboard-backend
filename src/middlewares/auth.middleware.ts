import { NextFunction, RequestHandler, Response } from "express";
import { ITokenPayload, Token, TokenType } from "../utils/Token";
import ApiError from "../utils/ApiError";
import prisma from "../lib/prisma";
import { cookieAccess, cookieRefresh } from "../utils/cookie";
import { User } from "../../generated/prisma/client";
import dayjs from "dayjs";
import { RequestValidation } from "./validation.middleware";

export interface RequestAuth extends RequestValidation {
  tokenPayload?: ITokenPayload;
  user?: User;
}

const auth = (type: TokenType = TokenType.ACCESS): RequestHandler => {
  return async (req: RequestAuth, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (type === TokenType.ACCESS) {
      token = req.cookies.access;
    } else if (type === TokenType.REFRESH) {
      token = req.cookies.refresh;
    }

    if (!token) {
      throw ApiError.Unauthorized(
        "Session expired or invalid, please login again",
      );
    }

    const tokenPayload = Token.verifyToken(token, type);

    if (!tokenPayload) {
      throw ApiError.Unauthorized("Invalid token, please login again");
    }

    const isBlacklisted = await prisma.blacklistedToken.findUnique({
      where: { jti: tokenPayload.jti },
    });

    if (isBlacklisted) {
      throw ApiError.Unauthorized("This session has been terminated");
    }

    const user = await prisma.user.findUnique({
      where: { id: tokenPayload.id },
    });

    if (!user) {
      throw ApiError.NotFound("User");
    }

    const logoutTime = user.logoutAt ? dayjs(user.logoutAt).unix() : 0;

    if (user.status === "BANNED" || logoutTime > tokenPayload.iat) {
      res.clearCookie("refresh", cookieRefresh);
      res.clearCookie("access", cookieAccess);

      if (user.status === "BANNED") {
        throw ApiError.AccountBlocked();
      }

      throw ApiError.Unauthorized("Session expired due to security changes");
    }

    req.tokenPayload = tokenPayload;
    req.user = user;

    next();
  };
};

export default auth;
