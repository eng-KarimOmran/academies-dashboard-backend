import z from "zod";
import {
  id,
  personName,
  password,
  phone,
  userRole,
  userStatus,
  limit,
  positiveNumber,
  boolean,
} from "../utils/common.validation";

export const CreateUserSchema = {
  body: z.object({
    name: personName,
    phone,
    password,
    status: userStatus.optional(),
  }),
};

export const UpdateUserSchema = {
  params: z.object({ id }),
  body: z.object({
    name: personName.optional(),
    phone: phone.optional(),
    password: password.optional(),
    role: userRole.optional(),
    status: userStatus.optional(),
    isPasswordChanged: boolean.optional(),
  }),
};

export const DeleteUserSchema = {
  params: z.object({ id }),
};

export const GetUserDetailsSchema = {
  params: z.object({ id }),
};

export const GetAllUsersSchema = {
  query: z.object({
    page: positiveNumber.optional().default(1),
    limit: limit.optional().default(50),
    search: z.string().optional(),
  }),
};
