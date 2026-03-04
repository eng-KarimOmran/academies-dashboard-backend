import { selectSafeKeys } from "../utils/safeKeys";
import * as DTO from "../DTOs/user.dto";
import prisma from "../lib/prisma";
import ApiError from "../utils/ApiError";
import HashHelper from "../utils/HashHelper";
import dayjs from "dayjs";
import { getPaginationParams } from "../utils/Pagination";
import { assertCanModifyUser } from "../utils/assertCanModifyUser";
import { Prisma, User } from "../../generated/prisma/client";

export class UserService {
  static async create(dataSafe: DTO.CreateUserDto) {
    const { body } = dataSafe;
    const { name, phone, password } = body;

    const userExists = await prisma.user.findUnique({ where: { phone } });
    if (userExists) throw ApiError.Conflict("Phone");

    const hashedPassword = await HashHelper.hash(password);

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        password: hashedPassword,
      },
      select: selectSafeKeys("user"),
    });

    return user;
  }

  static async update(currentUser: User, dataSafe: DTO.UpdateUserDto) {
    const { body, params } = dataSafe;
    const { id } = params;
    const { name, phone, password, status, role } = body;

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) throw ApiError.NotFound("User");

    assertCanModifyUser(currentUser, targetUser);

    const updateData: Prisma.UserUpdateInput = {};

    if (phone && phone !== targetUser.phone) {
      const phoneExists = await prisma.user.findUnique({ where: { phone } });
      if (phoneExists) throw ApiError.Conflict("Phone");
      updateData.phone = phone;
      updateData.logoutAt = dayjs().toDate();
    }

    if (password) {
      const isSamePassword = await HashHelper.verify(
        targetUser.password,
        password,
      );
      if (!isSamePassword) {
        updateData.password = await HashHelper.hash(password);
        updateData.logoutAt = dayjs().toDate();
      }
    }

    if (name && name !== targetUser.name) updateData.name = name;
    if (status && status !== targetUser.status) updateData.status = status;
    if (role && role !== targetUser.role) updateData.role = role;

    if (Object.keys(updateData).length === 0) {
      return targetUser;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: selectSafeKeys("user"),
    });

    return updatedUser;
  }

  static async delete(currentUser: User, dataSafe: DTO.DeleteUserDto) {
    const { params } = dataSafe;
    const { id } = params;

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) throw ApiError.NotFound("User");

    assertCanModifyUser(currentUser, targetUser);

    try {
      await prisma.user.delete({ where: { id } });
    } catch {
      throw ApiError.NotFound("User");
    }

    return true;
  }

  static async getAll(dataSafe: DTO.GetAllUsersDto) {
    const { query } = dataSafe;
    const { limit, page, search } = query;

    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
      ];
    }

    const total = await prisma.user.count({ where });

    const { safePage, skip, totalPages } = getPaginationParams({
      limit,
      page,
      total,
    });

    const items = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
      select: selectSafeKeys("user"),
    });

    return { items, pagination: { limit, page: safePage, total, totalPages } };
  }

  static async getDetails(dataSafe: DTO.GetUserDetailsDto) {
    const { params } = dataSafe;
    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        ...selectSafeKeys("user"),
        captainProfile: { select: selectSafeKeys("captain") },
        secretaryProfile: { select: selectSafeKeys("secretary") },
      },
    });

    if (!user) throw ApiError.NotFound("User");

    return user;
  }
}
