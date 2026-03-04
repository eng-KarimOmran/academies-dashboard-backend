import z from "zod";
import {
  CreateCarSchema,
  UpdateCarSchema,
  GetAllCarsSchema,
  GetCarDetailsSchema,
  DeleteCarSchema,
  FilterByTypeSchema
} from "../validations/car.validation";

export type CreateDto = {
  body: z.infer<typeof CreateCarSchema.body>;
};

export type UpdateDto = {
  params: z.infer<typeof UpdateCarSchema.params>;
  body: z.infer<typeof UpdateCarSchema.body>;
};

export type GetAllDto = {
  query: z.infer<typeof GetAllCarsSchema.query>;
};

export type GetDetailsDto = {
  params: z.infer<typeof GetCarDetailsSchema.params>;
};

export type DeleteDto = {
  params: z.infer<typeof DeleteCarSchema.params>;
};

export type FilterByTypeDto = {
  query: z.infer<typeof FilterByTypeSchema.query>;
};