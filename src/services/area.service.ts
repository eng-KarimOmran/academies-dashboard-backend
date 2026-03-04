import * as DTO from "../DTOs/area.dto";
import prisma from "../lib/prisma";
import ApiError from "../utils/ApiError";
import { getPaginationParams } from "../utils/Pagination";
import { Prisma } from "../../generated/prisma/client";

export class AreaService {
  static async getActive(dataSafe: DTO.FilterAreasDto) {
    const { type } = dataSafe.query;

    const where: Prisma.AreaWhereInput = {
      isActive: true,
    };

    if (type) {
      where.supportType = {
        in: ["BOTH", type],
      };
    }

    return await prisma.area.findMany({
      where,
      orderBy: { name: "asc" },
    });
  }

  static async create(dataSafe: DTO.CreateDto) {
    const { body } = dataSafe;

    const areaExists = await prisma.area.findUnique({
      where: { name: body.name },
    });

    if (areaExists) throw ApiError.Conflict("Name");

    return await prisma.area.create({ data: body });
  }

  static async getAll(dataSafe: DTO.GetAllDto) {
    const { limit, page, search } = dataSafe.query;

    const where: Prisma.AreaWhereInput = search
      ? { name: { contains: search, mode: "insensitive" } }
      : {};

    const total = await prisma.area.count({ where });

    const { safePage, skip, totalPages } = getPaginationParams({
      limit,
      page,
      total,
    });

    const items = await prisma.area.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return { items, pagination: { limit, page: safePage, total, totalPages } };
  }

  static async getDetails(dataSafe: DTO.GetDetailsDto) {
    const { id } = dataSafe.params;

    const area = await prisma.area.findUnique({ where: { id } });
    if (!area) throw ApiError.NotFound("Area");

    return area;
  }

  static async update(dataSafe: DTO.UpdateDto) {
    const { body, params } = dataSafe;
    const { id } = params;
    const { name, ...restOfData } = body;

    const area = await prisma.area.findUnique({ where: { id } });
    if (!area) throw ApiError.NotFound("Area");

    const updateData: Prisma.AreaUpdateInput = { ...restOfData };

    if (name && name !== area.name) {
      const nameTaken = await prisma.area.findUnique({ where: { name } });
      if (nameTaken) throw ApiError.Conflict("Name");
      updateData.name = name;
    }

    return await prisma.area.update({
      where: { id },
      data: updateData,
    });
  }

  static async delete(dataSafe: DTO.DeleteDto) {
    const { id } = dataSafe.params;

    const area = await prisma.area.findUnique({ where: { id } });
    if (!area) throw ApiError.NotFound("Area");

    return await prisma.area.delete({ where: { id } });
  }
}
