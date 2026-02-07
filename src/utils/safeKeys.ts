import { User } from "../../generated/prisma/client";

export const USER_SENSITIVE_KEYS: (keyof User)[] = [
  "updatedAt",
  "logoutAt",
  "password",
  "deletedAt",
];
