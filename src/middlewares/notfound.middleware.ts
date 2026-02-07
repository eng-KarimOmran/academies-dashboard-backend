import { Request, Response } from "express";
import ApiError from "../utils/ApiError";

export const notFound = (req: Request, res: Response) => {
  throw ApiError.NotFound("المسار");
};
