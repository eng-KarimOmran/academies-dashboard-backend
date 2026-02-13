import z from "zod";
import {
  Create,
  GetAll,
  GetDetails,
  Unsubscribe,
} from "../validations/subscription.validation";

export type CreateDto = {
  params: z.infer<typeof Create.params>;
  body: z.infer<typeof Create.body>;
};

export type UnsubscribeDto = {
  params: z.infer<typeof Unsubscribe.params>;
  body:z.infer<typeof Unsubscribe.body>;
};

export type GetAllDto = {
  params: z.infer<typeof GetAll.params>;
  query: z.infer<typeof GetAll.query>;
};

export type GetDetailsDto = {
  params: z.infer<typeof GetDetails.params>;
};
