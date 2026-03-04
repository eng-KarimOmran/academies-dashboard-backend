import { Response } from "express";
import * as DTO from "../DTOs/area.dto";
import { RequestAuth } from "../middlewares/auth.middleware";
import { AreaService } from "../services/area.service";
import sendSuccess from "../utils/successResponse";
import { RequestValidation } from "../middlewares/validation.middleware";

export const createArea = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.CreateDto;

  const area = await AreaService.create(dataSafe);

  return sendSuccess({
    res,
    statusCode: 201,
    data: area,
    message: "Area created successfully",
  });
};

export const updateArea = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.UpdateDto;

  const updatedArea = await AreaService.update(dataSafe);

  return sendSuccess({
    res,
    data: updatedArea,
    message: "Area updated successfully",
  });
};

export const deleteArea = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.DeleteDto;

  await AreaService.delete(dataSafe);

  return sendSuccess({
    res,
    message: "Area deleted permanently",
  });
};

export const getAllAreas = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.GetAllDto;

  const data = await AreaService.getAll(dataSafe);

  return sendSuccess({
    res,
    data,
  });
};

export const getDetailsArea = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.GetDetailsDto;

  const area = await AreaService.getDetails(dataSafe);

  return sendSuccess({
    res,
    data: area,
  });
};

export const getActiveAreas = async (req: RequestValidation, res: Response) => {
  const dataSafe = req.dataSafe as DTO.FilterAreasDto;

  const areas = await AreaService.getActive(dataSafe);

  return sendSuccess({
    res,
    data: areas,
  });
};
