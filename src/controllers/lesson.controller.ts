import { Response } from "express";
import * as DTO from "../DTOs/lesson.dto";
import { RequestAuth } from "../middlewares/auth.middleware";
import { LessonService } from "../services/lesson.service";
import sendSuccess from "../utils/successResponse";

export const createLesson = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.CreateLessonDto;

  const lesson = await LessonService.create(dataSafe);

  return sendSuccess({
    res,
    statusCode: 201,
    data: lesson,
    message: "Lesson scheduled successfully.",
  });
};

export const getAllLessons = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.GetAllLessonsDto;
  const userId = req.user!.id;

  const data = await LessonService.getAll(userId, dataSafe);

  return sendSuccess({
    res,
    data,
  });
};

export const getLessonDetails = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.GetLessonDetailsDto;

  const lessonData = await LessonService.getDetails(dataSafe);

  return sendSuccess({
    res,
    data: lessonData,
  });
};

export const updateLesson = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.UpdateLessonDto;

  const updatedLesson = await LessonService.update(dataSafe);

  return sendSuccess({
    res,
    data: updatedLesson,
    message: "Lesson details updated successfully.",
  });
};

export const changeLessonState = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.ChangeLessonStateDto;
  const userId = req.user!.id;

  const updatedLesson = await LessonService.changeState(userId, dataSafe);

  return sendSuccess({
    res,
    data: updatedLesson,
    message: `Lesson status changed to ${dataSafe.body.status}.`,
  });
};