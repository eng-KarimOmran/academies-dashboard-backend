import z from "zod";

import {
  id,
  name,
  limit,
  positiveNumber,
  string,
  phone,
} from "../utils/common.validation";

export const Create = {
  body: z.object({
    name,
    phone,
    academyId: id,
  }),
};

export const Update = {
  params: z.object({ id }),
  body: z.object({
    name: name.optional(),
    phone: phone.optional(),
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
