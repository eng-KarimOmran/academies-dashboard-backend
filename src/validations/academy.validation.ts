import z from "zod";
import {
  address,
  dateIso,
  id,
  limit,
  phone,
  platform,
  positiveNumber,
  string,
  textAndNum,
} from "../utils/common.validation";

export const Create = {
  body: z.object({
    name: textAndNum,
    owners: z.array(z.object({ phone })),
    phone,
    address,
    instaPay: string.optional(),
    socialMedia: z
      .array(
        z.object({
          platform,
          url: z.url(),
        }),
      )
      .optional(),
  }),
};

export const Update = {
  params: z.object({ academyId: id }),
  body: z.object({
    name: textAndNum.optional(),
    owners: z.array(z.object({ phone })).optional(),
    phone: phone.optional(),
    address: address.optional(),
    instaPay: string.optional(),
    socialMedia: z
      .array(
        z.object({
          platform,
          url: z.url(),
        }),
      )
      .optional(),
  }),
};

export const Delete = {
  params: z.object({ academyId: id }),
};

export const GetAll = {
  query: z.object({
    page: positiveNumber.optional().default(1),
    limit: limit,
  }),
};

export const Restore = {
  params: z.object({ academyId: id }),
};

export const GetAllDeleted = {
  query: z.object({
    page: positiveNumber.optional().default(1),
    limit: limit,
  }),
};

export const GetDetails = {
  params: z.object({ academyId: id }),
};
