import * as DTO from "../DTOs/client.dto";
import prisma from "../lib/prisma";
import ApiError from "../utils/ApiError";
import { getPaginationParams } from "../utils/Pagination";
import { Prisma } from "../../generated/prisma/client";
import { validateOwnership } from "../utils/validateOwnership";

export class ClientService {
  static async create(dataSafe: DTO.CreateClientDto) {
    const { body, params } = dataSafe;
    const { academyId } = params;

    const academy = await prisma.academy.findUnique({
      where: { id: academyId },
      include: {
        clients: {
          where: {
            phone: body.phone,
          },
        },
      },
    });

    if (!academy) throw ApiError.NotFound("Academy");
    if (academy.clients[0]) throw ApiError.Conflict("Phone");

    const client = await prisma.client.create({
      data: {
        academyId,
        name: body.name,
        phone: body.phone,
        clientSource: body.clientSource,
      },
    });

    return client;
  }

  static async getAll(userId: string, dataSafe: DTO.GetAllClientsDto) {
    const { query, params } = dataSafe;
    const { academyId } = params;
    const { limit, page, search } = query;

    await validateOwnership(userId, academyId);

    const where: Prisma.ClientWhereInput = { academyId };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
      ];
    }

    const total = await prisma.client.count({ where });
    const { safePage, skip, totalPages } = getPaginationParams({
      limit,
      page,
      total,
    });

    const items = await prisma.client.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return { items, pagination: { limit, page: safePage, total, totalPages } };
  }

  static async getDetails(dataSafe: DTO.ClientDetailsDto) {
    const { academyId, id } = dataSafe.params;

    const academy = await prisma.academy.findUnique({
      where: { id: academyId },
    });

    if (!academy) throw ApiError.NotFound("Academy");

    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        subscriptions: {
          include: {
            cancellation: true,
            payments: true,
            lessons: true,
            course: true,
          },
        },
      },
    });

    if (!client) throw ApiError.NotFound("Client");

    const otherFiles = await prisma.client.findMany({
      where: {
        phone: client.phone,
        NOT: { academyId },
      },
      select: {
        id: true,
        academy: { select: { id: true, name: true } },
      },
    });

    return { currentClient: client, otherFiles };
  }

  static async update(userId: string, dataSafe: DTO.UpdateClientDto) {
    const { body, params } = dataSafe;
    const { id, academyId } = params;

    await validateOwnership(userId, academyId);

    const client = await prisma.client.findUnique({
      where: { academyId_id: { academyId, id } },
    });

    if (!client) throw ApiError.NotFound("Client");

    if (body.phone && client.phone !== body.phone) {
      const existingPhone = await prisma.client.findUnique({
        where: {
          academyId_phone: {
            academyId,
            phone: body.phone,
          },
        },
      });

      if (existingPhone) throw ApiError.Conflict("Phone");
    }

    const updatedClient = await prisma.client.update({
      where: { id },
      data: body,
    });

    return updatedClient;
  }

  static async delete(userId: string, dataSafe: DTO.DeleteClientDto) {
    const { id, academyId } = dataSafe.params;

    await validateOwnership(userId, academyId);

    const client = await prisma.client.findUnique({
      where: { academyId_id: { academyId, id } },
    });

    if (!client) throw ApiError.NotFound("Client");

    await prisma.client.delete({
      where: { id },
    });

    return true;
  }
}
