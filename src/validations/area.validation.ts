import z from "zod";
import {
  id,
  limit,
  positiveNumber,
  entityName,
  transmission,
  boolean,
  trainingSupport,
} from "../utils/common.validation";

export const FilterAreasSchema = {
  query: z.object({
    type: transmission.optional(),
  }),
};

export const CreateAreaSchema = {
  body: z.object({
    name: entityName,
    supportType: trainingSupport.optional().default("BOTH"),
  }),
};

export const UpdateAreaSchema = {
  params: z.object({ id }),
  body: z.object({
    name: entityName.optional(),
    supportType: trainingSupport.optional(),
    isActive: boolean,
  }),
};

export const GetAllAreasSchema = {
  query: z.object({
    page: positiveNumber.optional().default(1),
    limit: limit,
    search: z.string().optional(),
  }),
};

export const GetAreaDetailsSchema = {
  params: z.object({ id }),
};

export const DeleteAreaSchema = {
  params: z.object({ id }),
};
