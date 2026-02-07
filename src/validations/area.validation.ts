import z from "zod";
import {
  boolean,
  id,
  limit,
  positiveNumber,
  textAndNum,
  trainingSupport,
} from "../utils/common.validation";

export const Create = {
  body: z.object({
    name: textAndNum,
    supportType: trainingSupport,
  }),
};

export const Update = {
  params: z.object({ id }),
  body: z.object({
    name: textAndNum.optional(),
    supportType: trainingSupport.optional(),
    isActive: boolean.optional(),
  }),
};

export const Delete = {
  params: z.object({ id }),
};

export const GetAll = {
  query: z.object({
    page: positiveNumber.optional().default(1),
    limit: limit,
  }),
};

export const Restore = {
  params: z.object({ id }),
};

export const GetAllDeleted = {
  query: z.object({
    page: positiveNumber.optional().default(1),
    limit: limit,
  }),
};

export const GetDetails = {
  params: z.object({ id }),
};
