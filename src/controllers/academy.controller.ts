import { Response } from "express";
import * as DTO from "../DTOs/academy.dto";
import { RequestAuth } from "../middlewares/auth.middleware";
import { AcademyService } from "../services/academy.service";
import sendSuccess from "../utils/successResponse";

export const createAcademy = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.CreateAcademyDto;

  const academy = await AcademyService.create(dataSafe);

  return sendSuccess({
    res,
    statusCode: 201,
    data: academy,
    message: "Academy created successfully",
  });
};

export const updateAcademy = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.UpdateAcademyDto;
  const userLogin = req.user!;

  const updatedAcademy = await AcademyService.update(userLogin, dataSafe);

  return sendSuccess({
    res,
    data: updatedAcademy,
    message: "Academy updated successfully",
  });
};

export const deleteAcademy = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.DeleteAcademyDto;
  const userLogin = req.user!;

  await AcademyService.delete(userLogin, dataSafe);

  return sendSuccess({
    res,
    message: "Academy deleted and user roles updated successfully",
  });
};

export const getAllAcademy = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.GetAllAcademiesDto;

  const data = await AcademyService.getAll(dataSafe);

  return sendSuccess({ res, data });
};

export const getDetailsAcademy = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.GetAcademyDetailsDto;

  const academy = await AcademyService.getDetails(dataSafe);

  return sendSuccess({ res, data: academy });
};
