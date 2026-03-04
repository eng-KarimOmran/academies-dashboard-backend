import ApiError from "./ApiError";
import { User } from "../../generated/prisma/client";

type UserAuthInfo = Pick<User, "id" | "role" | "createdAt">;

export const assertCanModifyUser = (
  currentUser: UserAuthInfo,
  targetUser: UserAuthInfo,
) => {
  if (currentUser.id === targetUser.id) return;

  if (targetUser.role !== "OWNER") return;

  const currentIsNewer =
    new Date(currentUser.createdAt).getTime() >
    new Date(targetUser.createdAt).getTime();

  if (currentIsNewer) {
    throw ApiError.Forbidden(
      "You cannot modify an owner who joined before you",
    );
  }
};