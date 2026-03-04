import { Response } from "express";
import { RequestAuth } from "../middlewares/auth.middleware";
import { RequestValidation } from "../middlewares/validation.middleware";
import * as DTO from "../DTOs/auth.dto";
import { AuthService } from "../services/auth.service";
import sendSuccess from "../utils/successResponse";
import { cookieAccess, cookieRefresh } from "../utils/cookie";
import { ITokenPayload } from "../utils/Token";

export const login = async (req: RequestValidation, res: Response) => {
  const dataSafe = req.dataSafe as DTO.LoginDto;

  const { user, tokens } = await AuthService.login(dataSafe);

  res.cookie("access", tokens.access, cookieAccess);
  res.cookie("refresh", tokens.refresh, cookieRefresh);

  return sendSuccess({
    res,
    data: user,
    message: "Logged in successfully",
  });
};

export const refresh = async (req: RequestAuth, res: Response) => {
  const userLogin = req.user!;

  const tokenPayload = req.tokenPayload as ITokenPayload;

  const { access } = await AuthService.refresh(userLogin, tokenPayload);

  res.cookie("access", access, cookieAccess);

  return sendSuccess({
    res,
    message: "Token refreshed successfully",
  });
};

export const logout = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.LogoutDto;
  const userLogin = req.user!;
  const tokenPayload = req.tokenPayload as ITokenPayload;

  await AuthService.logout(userLogin, tokenPayload, dataSafe);

  res.clearCookie("refresh", cookieRefresh);
  res.clearCookie("access", cookieAccess);

  return sendSuccess({
    res,
    message: "Logged out successfully",
  });
};

export const changePassword = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.ChangePasswordDto;
  const userLogin = req.user!;

  await AuthService.changePassword(userLogin, dataSafe);

  res.clearCookie("refresh", cookieRefresh);
  res.clearCookie("access", cookieAccess);

  return sendSuccess({
    res,
    message: "Password changed successfully. Please login again.",
  });
};
