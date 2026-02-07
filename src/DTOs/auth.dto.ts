import z from "zod";
import {
  LoginSchema,
  LogoutSchema,
  changePasswordSchema,
} from "../validations/auth.validation";

export type LoginDto = {
  body: z.infer<typeof LoginSchema.body>;
};

export type LogoutDto = {
  query: z.infer<typeof LogoutSchema.query>;
};

export type ChangePasswordDto = {
  body: z.infer<typeof changePasswordSchema.body>;
};
