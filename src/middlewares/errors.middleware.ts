import { NextFunction, Request, Response } from "express";
import { IErrorResponse } from "../utils/errorResponse";

const globalErrorHandler = (
  err: IErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";
  res.status(statusCode).send({
    status: statusCode,
    success: false,
    message,
  });
};

export default globalErrorHandler;
