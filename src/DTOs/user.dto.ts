import z from "zod";
import {
  Create,
  Delete,
  GetAll,
  Update,
  Restore,
  GetAllDeleted,
  GetDetails,
} from "../validations/user.validation";

export type CreateDto = {
  body: z.infer<typeof Create.body>;
};

export type UpdateDto = {
  params: z.infer<typeof Update.params>;
  body: z.infer<typeof Update.body>;
};

export type DeleteDto = {
  params: z.infer<typeof Delete.params>;
};

export type GetAllDto = {
  query: z.infer<typeof GetAll.query>;
};

export type GetAllDeletedDto = {
  query: z.infer<typeof GetAllDeleted.query>;
};

export type RestoreDto = {
  params: z.infer<typeof Restore.params>;
};

export type GetDetailsDto = {
  params: z.infer<typeof GetDetails.params>;
  query: z.infer<typeof GetDetails.query>;
};
