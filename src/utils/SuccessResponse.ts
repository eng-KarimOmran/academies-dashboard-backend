import { Response } from "express";

interface ISuccessResponse {
  res: Response;
  data?: any;
  message?: string;
  statusCode?: number;
}

const sendSuccess = ({
  res,
  data = null,
  message = "تمت العملية بنجاح",
  statusCode = 200,
}: ISuccessResponse) => {
  return res.status(statusCode).json({
    success: true,
    message,
    statusCode,
    data,
  });
};

export default sendSuccess;
