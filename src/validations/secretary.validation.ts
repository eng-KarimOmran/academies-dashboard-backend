import z from "zod";
import { boolean, id, limit, positiveNumber } from "../utils/common.validation";

export const Create = {
  body: z.object({
    userId: id,
    baseSalary: positiveNumber,
    target: positiveNumber,
    bonus: positiveNumber,
  }),
};

export const Update = {
  params: z.object({ id }),
  body: z.object({
    isActive: boolean.optional(),
    baseSalary: positiveNumber,
    target: positiveNumber,
    bonus: positiveNumber,
  }),
};

export const GetAll = {
  query: z.object({
    page: positiveNumber.optional().default(1),
    limit: limit,
  }),
};

export const GetDetails = {
  params: z.object({ id }),
};
