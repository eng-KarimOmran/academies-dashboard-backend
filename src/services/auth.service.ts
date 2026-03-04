import * as DTO from "../DTOs/auth.dto";
import prisma from "../lib/prisma";
import ApiError from "../utils/ApiError";
import HashHelper from "../utils/HashHelper";
import { ITokenPayload, Token } from "../utils/Token";
import { User } from "../../generated/prisma/client";
import dayjs from "dayjs";
import { selectSafeKeys } from "../utils/safeKeys";

export class AuthService {
  static async login(dataSafe: DTO.LoginDto) {
    const { phone, password } = dataSafe.body;

    const user = await prisma.user.findUnique({
      where: { phone },
      select: {
        ...selectSafeKeys("user"),
        password: true,
      },
    });

    if (!user) throw ApiError.NotFound("User");

    const isMatch = await HashHelper.verify(user.password, password);

    if (!isMatch) throw ApiError.BadRequest("Invalid phone number or password");

    if (user.status === "BANNED") throw ApiError.AccountBlocked();

    const { access, refresh } = Token.generateTokens(user.id);

    return {
      user: {
        id: user.id,
        name: user.name, 
        phone: user.phone,
        role: user.role,
      },
      tokens: { access, refresh },
    };
  }

  static async refresh(userLogin: User, tokenPayload: ITokenPayload) {
    const access = Token.generateAccessToken(userLogin.id, tokenPayload.jti);

    await prisma.blacklistedToken.deleteMany({
      where: {
        expiresAt: { lt: dayjs().toDate() },
      },
    });

    return { access };
  }

  static async logout(
    userLogin: User,
    tokenPayload: ITokenPayload,
    dataSafe: DTO.LogoutDto,
  ) {
    const { allDevices } = dataSafe.query;

    if (allDevices) {
      await prisma.user.update({
        where: { id: userLogin.id },
        data: { logoutAt: dayjs().toDate() },
      });
    } else {
      await prisma.blacklistedToken.create({
        data: {
          jti: tokenPayload.jti,
          expiresAt: dayjs.unix(tokenPayload.exp).toDate(),
        },
      });
    }
    return true;
  }

  static async changePassword(
    userLogin: User,
    dataSafe: DTO.ChangePasswordDto,
  ) {
    const { password } = dataSafe.body;
    const hashPassword = await HashHelper.hash(password);

    await prisma.user.update({
      where: { id: userLogin.id },
      data: {
        isPasswordChanged: true,
        logoutAt: dayjs().toDate(),
        password: hashPassword,
      },
    });

    return true;
  }
}