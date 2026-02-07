import z from "zod";
import {
  Platform,
  Role,
  TrainingSupport,
  UserStatus,
} from "../../generated/prisma/enums";

export const name = z
  .string("الاسم مطلوب")
  .trim()
  .min(2, "الاسم يجب أن يكون حرفين على الأقل")
  .max(50, "الاسم طويل جداً")
  .regex(/^[\u0621-\u064Aa-zA-Z\s]+$/, "الاسم يجب أن يحتوي على حروف فقط");

export const phone = z
  .string("رقم الهاتف مطلوب")
  .regex(/^01[0125]\d{8}$/, "رقم هاتف مصري غير صحيح");

export const password = z
  .string("كلمة المرور مطلوبة")
  .min(8, "كلمة المرور يجب أن تكون 8 رموز على الأقل")
  .max(32, "كلمة المرور طويلة جداً");

export const userRole = z.array(z.enum(Role));

export const boolean = z.coerce.boolean().optional().default(false);

export const id = z.cuid("المعرف غير صحيح");

export const statusUser = z.enum(UserStatus);

export const positiveNumber = z.coerce
  .number<number>("يجب ان يكون رقم صحيح")
  .positive("يجب ان يكون رقم صحيح موجب");

export const limit = positiveNumber
  .max(50, "الحد الاقصى 50")
  .optional()
  .default(50);

export const trainingSupport = z.enum(TrainingSupport);

export const textAndNum = z
  .string("الاسم مطلوب")
  .trim()
  .min(2, "الاسم يجب أن يكون حرفين على الأقل")
  .max(50, "الاسم طويل جداً")
  .regex(
    /^[\u0621-\u064Aa-zA-Z0-9\s]+$/,
    "الاسم يجب أن يحتوي على حروف أو أرقام فقط",
  );

export const address = z
  .string("العنوان مطلوب")
  .trim()
  .min(2, "العنوان يجب أن يكون حرفين على الأقل")
  .max(100, "العنوان طويل جداً");

export const dateIso = z.iso.datetime();

export const platform = z.enum(Platform);
