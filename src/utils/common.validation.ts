import z from "zod";
import {
  CancelReason,
  LessonStatus,
  PaymentMethod,
  Platform,
  Role,
  TrainingSupport,
  Transmission,
  UserStatus,
  SubscriptionStatus,
  TransactionType,
  Status,
  ExpenseType,
  ClientSource,
} from "../../generated/prisma/enums";

import dayjs from "dayjs";

// --- Basic Types ---

export const id = z.cuid("Invalid unique identifier");

export const personName = z
  .string("Name is required")
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name is too long (max 50)")
  .regex(/^[\u0621-\u064Aa-zA-Z\s]+$/, "Name must contain only letters");

export const entityName = z
  .string("Name is required")
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name is too long (max 50)")
  .regex(
    /^[\u0621-\u064Aa-zA-Z0-9\s]+$/,
    "Name must contain only letters and numbers",
  );

export const phone = z
  .string("Phone number is required")
  .regex(/^01[0125]\d{8}$/, "Invalid Egyptian phone number");

export const password = z
  .string("Password is required")
  .min(8, "Password must be at least 8 characters")
  .max(32, "Password is too long");

export const address = z
  .string("Address is required")
  .trim()
  .min(5, "Address must be at least 5 characters")
  .max(150, "Address is too long");

export const url = z.string("URL is required").url("Invalid URL format");

// --- Numbers & Finance ---

export const positiveNumber = z.coerce
  .number()
  .positive("Must be a positive number");

export const price = z.coerce.number().min(0, "Price cannot be negative");

export const count = z.coerce
  .number()
  .int("Must be an integer")
  .min(1, "Count must be at least 1");

export const limit = z.coerce.number().int().min(1).max(100).default(50);

// --- Dates ---

export const date = z.coerce.date();

export const futureDate = z.coerce
  .date()
  .refine((val) => dayjs(val).isAfter(dayjs().subtract(1, "minute")), {
    message: "Date must be in the present or future",
  });

// --- Enums Validation ---

export const userRole = z.enum(Role);
export const userStatus = z.enum(UserStatus);
export const trainingSupport = z.enum(TrainingSupport);
export const transmission = z.enum(Transmission);
export const platform = z.enum(Platform);
export const paymentMethod = z.enum(PaymentMethod);
export const cancelReason = z.enum(CancelReason);
export const lessonStatus = z.enum(LessonStatus);
export const subscriptionStatus = z.enum(SubscriptionStatus);
export const transactionType = z.enum(TransactionType);
export const transactionStatus = z.enum(Status);
export const expenseType = z.enum(ExpenseType);
export const clientSource = z.enum(ClientSource);

// --- Specialized Helpers ---

export const boolean = z.coerce.boolean();

export const plateNumber = z
  .string("Plate number is required")
  .min(3, "Invalid plate number")
  .max(10, "Plate number too long");
