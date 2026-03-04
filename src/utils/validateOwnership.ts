import prisma from "../lib/prisma";
import ApiError from "./ApiError";

export const validateOwnership = async (userId: string, academyId: string) => {
  const academy = await prisma.academy.findUnique({
    where: { id: academyId },
    include: { owners: { select: { id: true } } },
  });

  if (!academy) throw ApiError.NotFound("Academy");

  const isOwner = academy.owners.some((o) => o.id === userId);

  if (!isOwner) {
    throw ApiError.Forbidden();
  }

  return academy;
};