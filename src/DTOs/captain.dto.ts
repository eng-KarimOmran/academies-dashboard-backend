import z from "zod";
import {
  Create,
  GetAll,
  Update,
  GetDetails,
} from "../validations/captain.validation";

export type CreateDto = {
  body: z.infer<typeof Create.body>;
};

export type UpdateDto = {
  params: z.infer<typeof Update.params>;
  body: z.infer<typeof Update.body>;
};

export type GetAllDto = {
  query: z.infer<typeof GetAll.query>;
};

export type GetDetailsDto = {
  params: z.infer<typeof GetDetails.params>;
};
