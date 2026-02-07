import z from "zod";

import { boolean, password, phone } from "../utils/common.validation";

export const LoginSchema = {
  body: z.object({ phone, password }),
};

export const LogoutSchema = {
  query: z.object({ allDevices: boolean.optional().default(false) }),
};

export const changePasswordSchema = {
  body: z
    .object({
      password,
      confirmPassword: password,
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "كلمة السر وتأكيدها لازم يكونوا متطابقين",
      path: ["confirmPassword"],
    }),
};
