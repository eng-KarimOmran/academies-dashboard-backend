import z from "zod";
import {
  id,
  limit,
  positiveNumber,
  boolean,
  phone,
} from "../utils/common.validation";

export const CreateSecretarySchema = {
  body: z.object({
    phone: phone,
    baseSalary: positiveNumber,
    targetCount: positiveNumber,
    bonusAmount: positiveNumber,
  }),
};

export const UpdateSecretarySchema = {
  params: z.object({ id }),
  body: z.object({
    baseSalary: positiveNumber.optional(),
    targetCount: positiveNumber.optional(),
    bonusAmount: positiveNumber.optional(),
  }),
};

export const GetAllSecretariesSchema = {
  query: z.object({
    page: positiveNumber.optional().default(1),
    limit: limit,
    search: z.string().optional(),
  }),
};

export const GetSecretaryDetailsSchema = {
  params: z.object({ id }),
};

export const DeleteSecretarySchema = {
  params: z.object({ id }),
};
