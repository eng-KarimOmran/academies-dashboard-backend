import { Response } from "express";
import { RequestAuth } from "../middlewares/auth.middleware";
import * as DTO from "../DTOs/user.dto";
import sendSuccess from "../utils/successResponse";
import { UserService } from "../services/user.service";
import { User } from "../../generated/prisma/client";

export const createUser = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.CreateUserDto;

  const user = await UserService.create(dataSafe);

  return sendSuccess({
    res,
    statusCode: 201,
    data: user,
    message: "User created successfully",
  });
};

export const updateUser = async (req: RequestAuth, res: Response) => {
  const currentUser = req.user as User;
  const dataSafe = req.dataSafe as DTO.UpdateUserDto;

  const updatedUser = await UserService.update(currentUser, dataSafe);

  return sendSuccess({
    res,
    data: updatedUser,
    message: "User updated successfully",
  });
};

export const deleteUser = async (req: RequestAuth, res: Response) => {
  const currentUser = req.user as User;
  const dataSafe = req.dataSafe as DTO.DeleteUserDto;

  await UserService.delete(currentUser, dataSafe);

  return sendSuccess({
    res,
    message: "User deleted permanently",
  });
};

export const getAllUser = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.GetAllUsersDto;

  const data = await UserService.getAll(dataSafe);

  return sendSuccess({
    res,
    data,
  });
};

export const getDetailsUser = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.GetUserDetailsDto;

  const user = await UserService.getDetails(dataSafe);

  return sendSuccess({ res, data: user });
};
