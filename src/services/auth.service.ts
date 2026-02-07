import { Response } from "express";
import * as DTO from "../DTOs/auth.dto";
import prisma from "../lib/prisma";
import ApiError from "../utils/ApiError";
import sendSuccess from "../utils/successResponse";
import HashHelper from "../utils/HashHelper";
import { ITokenPayload, Token } from "../utils/Token";
import { cookieAccess, cookieRefresh } from "../utils/cookie";
import { RequestAuth } from "../middlewares/auth.middleware";
import { User } from "../../generated/prisma/client";
import dayjs from "dayjs";
import env from "../config/env";
import { omitKeys } from "../utils/omitKeys";
import { RequestValidation } from "../middlewares/validation.middleware";
import { USER_SENSITIVE_KEYS } from "../utils/safeKeys";

export const login = async (req: RequestValidation, res: Response) => {
  const { body } = req.dataSafe as DTO.LoginDto;
  const { phone, password } = body;

  const user = await prisma.user.findUnique({
    where: {
      phone,
      deletedAt: null,
    },
  });

  if (!user) throw ApiError.NotFound("المستخدم");

  const isMatch = await HashHelper.verify(user.password, password);

  if (!isMatch) throw ApiError.BadRequest("كلمة المرور خطأ");

  if (user.status === "BANNED") throw ApiError.Blocked("الحساب");

  const { access, refresh } = Token.generateTokens(user.id);

  res.cookie("access", access, cookieAccess);
  res.cookie("refresh", refresh, cookieRefresh);

  const userSafe = omitKeys<User>(user, USER_SENSITIVE_KEYS);

  return sendSuccess({
    res,
    data: userSafe,
  });
};

export const refresh = async (req: RequestAuth, res: Response) => {
  const user = req.user as User;
  const tokenPayload = req.tokenPayload as ITokenPayload;
  const access = Token.generateAccessToken(user.id, tokenPayload.jti);

  res.cookie("access", access, cookieAccess);

  const userSafe = omitKeys<User>(user, USER_SENSITIVE_KEYS);

  return sendSuccess({
    res,
    data: userSafe,
  });
};

export const logout = async (req: RequestAuth, res: Response) => {
  console.log(req.dataSafe);
  const { query } = req.dataSafe as DTO.LogoutDto;
  const { allDevices } = query;

  const user = req.user as User;
  const tokenPayload = req.tokenPayload as ITokenPayload;

  if (allDevices) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        logoutAt: dayjs().toDate(),
      },
    });
  } else {
    await prisma.invalidToken.create({
      data: {
        userId: user.id,
        jti: tokenPayload.jti,
        expiresAt: dayjs().add(env.token.REFRESH_EXPIRATION, "second").toDate(),
      },
    });
  }

  res.clearCookie("refresh", cookieRefresh);
  res.clearCookie("access", cookieAccess);

  return sendSuccess({ res });
};

export const changePassword = async (req: RequestAuth, res: Response) => {
  const { body } = req.dataSafe as DTO.LoginDto;
  const { password } = body;
  const user = req.user as User;
  const hashPassword = await HashHelper.hash(password);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      isPasswordChanged: true,
      logoutAt: dayjs().toDate(),
      password: hashPassword,
    },
  });
  res.clearCookie("refresh", cookieRefresh);
  res.clearCookie("access", cookieAccess);

  return sendSuccess({ res });
};