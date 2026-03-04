import z from "zod";
import {
  address,
  id,
  limit,
  phone,
  platform,
  positiveNumber,
  url,
  entityName,
} from "../utils/common.validation";

const socialMediaSchema = z.object({
  platform,
  url,
});

const ownerSchema = z.object({
  phone,
});

export const CreateAcademySchema = {
  body: z.object({
    name: entityName,
    phone,
    address,
    instaPay: z.string().optional(),
    owners: z.array(ownerSchema).min(1, "At least one owner phone is required"),
    socialMedia: z.array(socialMediaSchema).min(1).optional(),
  }),
};

export const UpdateAcademySchema = {
  params: z.object({ academyId: id }),
  body: z.object({
    name: entityName.optional(),
    phone: phone.optional(),
    address: address.optional(),
    instaPay: z.string().optional(),
    owners: z.array(ownerSchema).min(1).optional(),
    socialMedia: z.array(socialMediaSchema).min(1).optional(),
  }),
};

export const DeleteAcademySchema = {
  params: z.object({ academyId: id }),
};

export const GetAcademySchema = {
  params: z.object({ academyId: id }),
};

export const GetAllAcademiesSchema = {
  query: z.object({
    page: positiveNumber.optional().default(1),
    limit: limit.optional().default(50),
    search: z.string().optional(),
  }),
};
