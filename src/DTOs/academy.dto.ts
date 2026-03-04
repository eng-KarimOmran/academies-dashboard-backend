import z from "zod";
import {
  CreateAcademySchema,
  UpdateAcademySchema,
  DeleteAcademySchema,
  GetAllAcademiesSchema,
  GetAcademySchema,
} from "../validations/academy.validation";

// 1. Create Academy DTO
export type CreateAcademyDto = {
  body: z.infer<typeof CreateAcademySchema.body>;
};

// 2. Update Academy DTO
export type UpdateAcademyDto = {
  params: z.infer<typeof UpdateAcademySchema.params>;
  body: z.infer<typeof UpdateAcademySchema.body>;
};

// 3. Delete Academy DTO
export type DeleteAcademyDto = {
  params: z.infer<typeof DeleteAcademySchema.params>;
};

// 4. Get All Academies DTO
export type GetAllAcademiesDto = {
  query: z.infer<typeof GetAllAcademiesSchema.query>;
};

// 5. Get Details Academy DTO
export type GetAcademyDetailsDto = {
  params: z.infer<typeof GetAcademySchema.params>;
};