import { Response } from "express";
import { RequestAuth } from "../middlewares/auth.middleware";
import * as DTO from "../DTOs/secretary.dto";
import sendSuccess from "../utils/successResponse";
import { SecretaryService } from "../services/secretary.service";

export const createSecretary = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.CreateDto;

  const secretary = await SecretaryService.create(dataSafe);

  return sendSuccess({
    res,
    statusCode: 201,
    data: secretary,
    message: "Secretary profile created successfully",
  });
};

export const updateSecretary = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.UpdateDto;

  const secretaryUpdate = await SecretaryService.update(dataSafe);

  return sendSuccess({
    res,
    data: secretaryUpdate,
    message: "Secretary profile updated successfully",
  });
};

export const getAllSecretary = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.GetAllDto;

  const data = await SecretaryService.getAll(dataSafe);

  return sendSuccess({ res, data });
};

export const getDetailsSecretary = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.GetDetailsDto;

  const secretary = await SecretaryService.getDetails(dataSafe);

  return sendSuccess({ res, data: secretary });
};

export const deleteSecretary = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.DeleteDto;

  await SecretaryService.delete(dataSafe);

  return sendSuccess({ 
    res, 
    message: "Secretary profile deleted permanently" 
  });
};
