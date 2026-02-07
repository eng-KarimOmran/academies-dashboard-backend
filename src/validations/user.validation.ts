import z from "zod";

import {
  id,
  name,
  password,
  phone,
  userRole,
  statusUser,
  limit,
  positiveNumber,
  trainingSupport,
} from "../utils/common.validation";

export const Create = {
  body: z
    .object({
      name,
      phone,
      password,
      role: userRole,
      captainProfile: z
        .object({
          captainLessonPrice: positiveNumber,
          trainingType: trainingSupport,
        })
        .optional(),
      secretaryProfile: z
        .object({
          baseSalary: positiveNumber,
          bonus: positiveNumber,
          target: positiveNumber,
        })
        .optional(),
    })
    .check(
      z.refine(
        (data) => !(data.role.includes("CAPTAIN") && !data.captainProfile),
        {
          message: "لازم تحدد بيانات الكابتن",
          path: ["captainProfile"],
        },
      ),
      z.refine(
        (data) => !(data.role.includes("SECRETARY") && !data.secretaryProfile),
        {
          message: "لازم تحدد بيانات السكرتير",
          path: ["secretaryProfile"],
        },
      ),
    ),
};

export const Update = {
  params: z.object({ id }),
  body: z.object({
    name: name.optional(),
    phone: phone.optional(),
    password: password.optional(),
    role: userRole.optional(),
    status: statusUser.optional(),
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
  query: z.object({
    page: positiveNumber.optional().default(1),
    limit: limit,
  }),
};