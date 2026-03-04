import z from "zod";
import * as Schema from "../validations/course.validation";

export type CreateDto = {
  params: z.infer<typeof Schema.CreateSchema.params>;
  body: z.infer<typeof Schema.CreateSchema.body>;
};

export type UpdateDto = {
  params: z.infer<typeof Schema.UpdateSchema.params>;
  body: z.infer<typeof Schema.UpdateSchema.body>;
};

export type DeleteDto = {
  params: z.infer<typeof Schema.DeleteSchema.params>;
};

export type GetAllDto = {
  params: z.infer<typeof Schema.GetAllSchema.params>;
  query: z.infer<typeof Schema.GetAllSchema.query>;
};

export type GetDetailsDto = {
  params: z.infer<typeof Schema.GetDetailsSchema.params>;
};

export type GetActiveDto = {
  params: z.infer<typeof Schema.GetActiveSchema.params>;
};
