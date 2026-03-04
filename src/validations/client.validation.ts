import z from "zod";
import {
  id,
  limit,
  positiveNumber,
  phone,
  personName,
  clientSource,
} from "../utils/common.validation";

export const CreateClientSchema = {
  params: z.object({ academyId: id }),
  body: z.object({
    name: personName,
    phone,
    clientSource,
  }),
};

export const UpdateClientSchema = {
  params: z.object({ id, academyId: id }),
  body: z.object({
    name: personName.optional(),
    phone: phone.optional(),
  }),
};

export const DeleteClientSchema = {
  params: z.object({ id, academyId: id }),
};

export const GetAllClientsSchema = {
  params: z.object({ academyId: id }),
  query: z.object({
    page: positiveNumber.optional().default(1),
    limit: limit,
    search: z.string().optional(),
  }),
};

export const GetClientDetailsSchema = {
  params: z.object({ academyId: id, id }),
};
