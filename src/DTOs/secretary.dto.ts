import z from "zod";
import {
  CreateSecretarySchema,
  UpdateSecretarySchema,
  GetAllSecretariesSchema,
  GetSecretaryDetailsSchema,
  DeleteSecretarySchema,
} from "../validations/secretary.validation";

export type CreateDto = {
  body: z.infer<typeof CreateSecretarySchema.body>;
};

export type UpdateDto = {
  params: z.infer<typeof UpdateSecretarySchema.params>;
  body: z.infer<typeof UpdateSecretarySchema.body>;
};

export type GetAllDto = {
  query: z.infer<typeof GetAllSecretariesSchema.query>;
};

export type GetDetailsDto = {
  params: z.infer<typeof GetSecretaryDetailsSchema.params>;
};

export type DeleteDto = {
  params: z.infer<typeof DeleteSecretarySchema.params>;
};