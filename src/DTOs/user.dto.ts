import z from "zod";
import {
  CreateUserSchema,
  UpdateUserSchema,
  DeleteUserSchema,
  GetAllUsersSchema,
  GetUserSchema,
} from "../validations/user.validation";

// 1. Create User DTO
export type CreateUserDto = {
  body: z.infer<typeof CreateUserSchema.body>;
};

// 2. Update User DTO
export type UpdateUserDto = {
  params: z.infer<typeof UpdateUserSchema.params>;
  body: z.infer<typeof UpdateUserSchema.body>;
};

// 3. Delete User DTO
export type DeleteUserDto = {
  params: z.infer<typeof DeleteUserSchema.params>;
};

// 4. Get All Users DTO (Query Params)
export type GetAllUsersDto = {
  query: z.infer<typeof GetAllUsersSchema.query>;
};

// 5. Get User Details DTO
export type GetUserDetailsDto = {
  params: z.infer<typeof GetUserSchema.params>;
};