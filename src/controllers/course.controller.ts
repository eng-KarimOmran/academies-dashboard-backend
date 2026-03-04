import { Response } from "express";
import { RequestAuth } from "../middlewares/auth.middleware";
import * as DTO from "../DTOs/course.dto";
import sendSuccess from "../utils/successResponse";
import { CourseService } from "../services/course.service";
import { RequestValidation } from "../middlewares/validation.middleware";

export const createCourse = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.CreateDto;
  const userId = req.user!.id;

  const course = await CourseService.create(userId, dataSafe);

  return sendSuccess({
    res,
    statusCode: 201,
    data: course,
    message: "تم إضافة البرنامج بنجاح",
  });
};

export const updateCourse = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.UpdateDto;
  const userId = req.user!.id;

  const updatedCourse = await CourseService.update(userId, dataSafe);

  return sendSuccess({
    res,
    data: updatedCourse,
    message: "تم تحديث البرنامج بنجاح",
  });
};

export const getAllCourses = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.GetAllDto;

  const data = await CourseService.getAll(dataSafe);

  return sendSuccess({
    res,
    data,
  });
};

export const getActiveCourses = async (
  req: RequestValidation,
  res: Response,
) => {
  const dataSafe = req.dataSafe as DTO.GetActiveDto;

  const items = await CourseService.getActive(dataSafe);

  return sendSuccess({ res, data: items });
};

export const getDetailsCourse = async (
  req: RequestValidation,
  res: Response,
) => {
  const dataSafe = req.dataSafe as DTO.GetDetailsDto;

  const course = await CourseService.getDetails(dataSafe);

  return sendSuccess({ res, data: course });
};

export const deleteCourse = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.DeleteDto;
  const userId = req.user!.id;

  await CourseService.delete(userId, dataSafe);

  return sendSuccess({ res, message: "تم حذف البرنامج نهائياً" });
};
