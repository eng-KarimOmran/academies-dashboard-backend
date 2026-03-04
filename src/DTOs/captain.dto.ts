import z from "zod";
import {
  CreateCaptainSchema,
  UpdateCaptainSchema,
  GetAllCaptainsSchema,
  GetCaptainDetailsSchema,
  DeleteCaptainSchema,
  FilterCaptainsSchema,
  GetCaptainScheduleSchema,
} from "../validations/captain.validation";

export type CreateDto = {
  body: z.infer<typeof CreateCaptainSchema.body>;
};

export type UpdateDto = {
  params: z.infer<typeof UpdateCaptainSchema.params>;
  body: z.infer<typeof UpdateCaptainSchema.body>;
};

export type GetAllDto = {
  query: z.infer<typeof GetAllCaptainsSchema.query>;
};

export type GetDetailsDto = {
  params: z.infer<typeof GetCaptainDetailsSchema.params>;
};

export type DeleteDto = {
  params: z.infer<typeof DeleteCaptainSchema.params>;
};

export type FilterCaptainsDto = {
  query: z.infer<typeof FilterCaptainsSchema.query>;
};

export type GetCaptainScheduleDto = {
  params: z.infer<typeof GetCaptainScheduleSchema.params>;
  query: z.infer<typeof GetCaptainScheduleSchema.query>;
};
