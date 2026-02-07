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
    owners: z.array(z.object({ id })),
    phone,
    address,
    instaPay: string,
    socialMedia: z.array(
      z.object({
        platform,
        url: z.url(),
      }),
    ),
  }),
};

export const Update = {
  params: z.object({ id }),
  body: z.object({
    name: textAndNum.optional(),
    owners: z.array(z.object({ id })).optional(),
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
