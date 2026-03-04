import z from "zod";
import * as Schema from "../validations/lesson.validation";

export type CreateLessonDto = {
  params: z.infer<typeof Schema.CreateLessonSchema.params>;
  body: z.infer<typeof Schema.CreateLessonSchema.body>;
};

export type GetAllLessonsDto = {
  params: z.infer<typeof Schema.GetAllLessonsSchema.params>;
  query: z.infer<typeof Schema.GetAllLessonsSchema.query>;
};

export type GetLessonDetailsDto = {
  params: z.infer<typeof Schema.GetLessonDetailsSchema.params>;
};

export type UpdateLessonDto = {
  params: z.infer<typeof Schema.UpdateLessonSchema.params>;
  body: z.infer<typeof Schema.UpdateLessonSchema.body>;
};

export type ChangeLessonStateDto = {
  params: z.infer<typeof Schema.ChangeLessonState.params>;
  body: z.infer<typeof Schema.ChangeLessonState.body>;
};