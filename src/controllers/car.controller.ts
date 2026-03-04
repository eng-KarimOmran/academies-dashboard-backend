import { Response } from "express";
import { RequestAuth } from "../middlewares/auth.middleware";
import * as DTO from "../DTOs/car.dto";
import sendSuccess from "../utils/successResponse";
import { CarService } from "../services/car.service";

export const createCar = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.CreateDto;
  
  const car = await CarService.create(dataSafe);

  return sendSuccess({
    res,
    statusCode: 201,
    data: car,
    message: "Car created successfully",
  });
};

export const updateCar = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.UpdateDto;
  
  const carUpdate = await CarService.update(dataSafe);

  return sendSuccess({
    res,
    data: carUpdate,
    message: "Car updated successfully",
  });
};

export const getAllCars = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.GetAllDto;
  
  const data = await CarService.getAll(dataSafe);

  return sendSuccess({ res, data });
};

export const getDetailsCar = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.GetDetailsDto;
  
  const car = await CarService.getDetails(dataSafe);

  return sendSuccess({ res, data: car });
};

export const deleteCar = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.DeleteDto;
  
  await CarService.delete(dataSafe);

  return sendSuccess({
    res,
    message: "Car deleted permanently",
  });
};

export const getActiveCars = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.FilterByTypeDto;
  
  const cars = await CarService.getActiveCars(dataSafe);

  return sendSuccess({ res, data: cars });
};
