import z from "zod";
import {
  id,
  limit,
  boolean,
  transmission,
  phone,
  entityName,
  price,
  positiveNumber,
} from "../utils/common.validation";

export const CreateCarSchema = {
  body: z.object({
    plateNumber: entityName,
    modelName: entityName,
    gearType: transmission,
    carSessionPrice: price.optional().default(0),
    phones: z
      .array(phone)
      .min(1, "At least one owner phone is required")
      .optional(),
  }),
};

export const UpdateCarSchema = {
  params: z.object({ id }),
  body: z.object({
    plateNumber: entityName.optional(),
    modelName: entityName.optional(),
    gearType: transmission.optional(),
    carSessionPrice: price.optional(),
    isActive: boolean.optional(),
    phones: z
      .array(phone)
      .min(1, "At least one owner phone is required")
      .optional(),
  }),
};

export const GetAllCarsSchema = {
  query: z.object({
    page: positiveNumber.optional().default(1),
    limit: limit,
    search: z.string().optional(),
  }),
};

export const GetCarDetailsSchema = {
  params: z.object({ id }),
};

export const DeleteCarSchema = {
  params: z.object({ id }),
};

export const FilterByTypeSchema = {
  query: z.object({
    type: transmission.optional(),
  }),
};
