import z from "zod";
import {
  id,
  limit,
  positiveNumber,
  trainingSupport,
  boolean,
  textAndNum,
  transmission,
  ownerType,
} from "../utils/common.validation";

export const Create = {
  body: z
    .object({
      plateNumber: textAndNum,
      gearType: transmission,
      ownerType: ownerType,
      modelName: textAndNum,
      carSessionPrice: positiveNumber.optional(),
      captainId: id.optional(),
    })
    .superRefine((data, ctx) => {
      if (data.ownerType === "ACADEMY_FLEET") {
        if (data.carSessionPrice === null) {
          ctx.addIssue({
            code: "custom",
            path: ["carSessionPrice"],
            message:
              "carSessionPrice is required when ownerType is ACADEMY_FLEET",
          });
        }
      }
      if (data.ownerType === "INDIVIDUAL_CAPTAIN") {
        if (data.captainId == null) {
          ctx.addIssue({
            code: "custom",
            path: ["captainId"],
            message:
              "captainId is required when ownerType is INDIVIDUAL_CAPTAIN",
          });
        }
      }
    }),
};

export const Update = {
  params: z.object({ id }),
  body: z.object({
    plateNumber: textAndNum.optional(),
    gearType: transmission.optional(),
    ownerType: ownerType.optional(),
    modelName: textAndNum.optional(),
    carSessionPrice: positiveNumber.optional(),
    captainId: id.optional(),
    isActive: boolean.optional(),
  }),
};

export const GetAll = {
  query: z.object({
    page: positiveNumber.optional().default(1),
    limit: limit,
  }),
};

export const GetDetails = {
  params: z.object({ id }),
};

export const Delete = {
  params: z.object({ id }),
};

export const GetAllDeleted = {
  query: z.object({
    page: positiveNumber.optional().default(1),
    limit: limit,
  }),
};

export const Restore = {
  params: z.object({ id }),
};
