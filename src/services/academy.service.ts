import * as DTO from "../DTOs/academy.dto";
import prisma from "../lib/prisma";
import ApiError from "../utils/ApiError";
import { getPaginationParams } from "../utils/Pagination";
import { Prisma, User } from "../../generated/prisma/client";
import { validateOwnership } from "../utils/validateOwnership";

export class AcademyService {
  static async create(dataSafe: DTO.CreateAcademyDto) {
    const { body } = dataSafe;
    const { name, address, phone, instaPay, owners, socialMedia } = body;

    const academyExists = await prisma.academy.findFirst({
      where: { OR: [{ name }, { phone }] },
    });

    if (academyExists) {
      if (academyExists.name === name) throw ApiError.Conflict("Name");
      throw ApiError.Conflict("Phone");
    }

    const uniqueOwnerPhones = [...new Set(owners.map((o) => o.phone))];

    const users = await prisma.user.findMany({
      where: { phone: { in: uniqueOwnerPhones } },
    });

    if (users.length !== uniqueOwnerPhones.length) {
      throw ApiError.NotFound("User");
    }

    const academy = await prisma.$transaction(async (tx) => {
      await tx.user.updateMany({
        where: { id: { in: users.map((u) => u.id) } },
        data: { role: "OWNER" },
      });

      return await tx.academy.create({
        data: {
          name,
          phone,
          address,
          instaPay,
          owners: {
            connect: users.map((u) => ({ id: u.id })),
          },
          socialMediaPlatforms: {
            create: socialMedia ?? [],
          },
        },
        include: {
          socialMediaPlatforms: true,
        },
      });
    });

    return academy;
  }

  static async getAll(dataSafe: DTO.GetAllAcademiesDto) {
    const { query } = dataSafe;
    const { limit, page, search } = query;
    
    const where: Prisma.AcademyWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const total = await prisma.academy.count({ where });

    const { safePage, skip, totalPages } = getPaginationParams({
      limit,
      page,
      total,
    });

    const items = await prisma.academy.findMany({
      where,
      include: { socialMediaPlatforms: true },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
    });

    return { items, pagination: { limit, page: safePage, total, totalPages } };
  }

  static async update(userLogin: User, dataSafe: DTO.UpdateAcademyDto) {
    const { body, params } = dataSafe;
    const { academyId } = params;

    const academy = await validateOwnership(userLogin.id, academyId);

    const { name, phone, socialMedia, owners, ...restOfData } = body;

    const updateData: Prisma.AcademyUpdateInput = { ...restOfData };

    if (name && name !== academy.name) {
      const nameExists = await prisma.academy.findUnique({ where: { name } });
      if (nameExists) throw ApiError.Conflict("Name");
      updateData.name = name;
    }

    if (phone && phone !== academy.phone) {
      const phoneExists = await prisma.academy.findUnique({ where: { phone } });
      if (phoneExists) throw ApiError.Conflict("Phone");
      updateData.phone = phone;
    }

    if (socialMedia) {
      updateData.socialMediaPlatforms = {
        deleteMany: {},
        create: socialMedia,
      };
    }

    let usersToUpdateRole: { id: string }[] = [];

    if (owners) {
      const uniquePhones = [...new Set(owners.map((o) => o.phone))];
      const users = await prisma.user.findMany({
        where: { phone: { in: uniquePhones } },
      });

      if (users.length !== uniquePhones.length) throw ApiError.NotFound("User");

      usersToUpdateRole = users;
      updateData.owners = { set: users.map((u) => ({ id: u.id })) };
    }

    return await prisma.$transaction(async (tx) => {
      if (usersToUpdateRole.length > 0) {
        await tx.user.updateMany({
          where: { id: { in: usersToUpdateRole.map((u) => u.id) } },
          data: { role: "OWNER" },
        });
      }

      return tx.academy.update({
        where: { id: academyId },
        data: updateData,
        include: {
          socialMediaPlatforms: true,
        },
      });
    });
  }

  static async delete(userLogin: User, dataSafe: DTO.DeleteAcademyDto) {
    const { params } = dataSafe;
    const { academyId } = params;

    await validateOwnership(userLogin.id, academyId);

    return await prisma.academy.delete({ where: { id: academyId } });
  }

  static async getDetails(dataSafe: DTO.GetAcademyDetailsDto) {
    const { params } = dataSafe;
    const { academyId } = params;

    const academy = await prisma.academy.findUnique({
      where: { id: academyId },
      include: {
        socialMediaPlatforms: true,
      },
    });

    if (!academy) throw ApiError.NotFound("Academy");

    return academy;
  }
}
