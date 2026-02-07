import { NextFunction, Request, RequestHandler, Response } from "express";
import { ZodError, ZodObject } from "zod";
import ApiError from "../utils/ApiError";

export interface RequestValidation extends Request {
  dataSafe?: {
    body?: Record<string, unknown>;
    query?: Record<string, unknown>;
    params?: Record<string, unknown>;
  };
}

export interface ValidationSchemas {
  body?: ZodObject;
  query?: ZodObject;
  params?: ZodObject;
}

const validation = ({ body, params, query }: ValidationSchemas):RequestHandler => {
  return async (req: RequestValidation, res: Response, next: NextFunction) => {
    try {
      if (!req.dataSafe) req.dataSafe = {};

      if (body) {
        req.dataSafe.body = await body.strict().parseAsync(req.body);
      }

      if (query) {
        req.dataSafe.query = await query.strict().parseAsync(req.query);
      }

      if (params) {
        req.dataSafe.params = await params.strict().parseAsync(req.params);
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message = err.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(" | ");
        throw ApiError.ValidationError(message);
      }
    }
  };
};

export default validation;
