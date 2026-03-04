import { Response } from "express";
import { RequestAuth } from "../middlewares/auth.middleware";
import * as DTO from "../DTOs/captain.dto";
import sendSuccess from "../utils/successResponse";
import { CaptainService } from "../services/captain.service";

export const createCaptain = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.CreateDto;

  const captain = await CaptainService.create(dataSafe);

  return sendSuccess({
    res,
    statusCode: 201,
    data: captain,
    message: "Captain profile created successfully",
  });
};

export const updateCaptain = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.UpdateDto;

  const captain = await CaptainService.update(dataSafe);

  return sendSuccess({
    res,
    data: captain,
    message: "Captain updated successfully",
  });
};

export const getAllCaptains = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.GetAllDto;

  const data = await CaptainService.getAll(dataSafe);

  return sendSuccess({
    res,
    data,
  });
};

export const getDetailsCaptain = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.GetDetailsDto;

  const captain = await CaptainService.getDetails(dataSafe);

  return sendSuccess({
    res,
    data: captain,
  });
};

export const deleteCaptain = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.DeleteDto;

  await CaptainService.delete(dataSafe);

  return sendSuccess({
    res,
    message: "Captain profile deleted permanently",
  });
};

export const getActiveCaptains = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.FilterCaptainsDto;

  const captains = await CaptainService.getActive(dataSafe);

  return sendSuccess({
    res,
    data: captains,
    message: `Available captains retrieved successfully`,
  });
};

export const getCaptainSchedule = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.GetCaptainScheduleDto;

  const lessons = await CaptainService.getCaptainSchedule(dataSafe);

  return sendSuccess({
    res,
    data: lessons,
  });
};
