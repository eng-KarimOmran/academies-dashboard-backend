import { Response } from "express";
import * as DTO from "../DTOs/client.dto";
import { RequestAuth } from "../middlewares/auth.middleware";
import { ClientService } from "../services/client.service";
import sendSuccess from "../utils/successResponse";

export const createClient = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.CreateClientDto;

  const client = await ClientService.create(dataSafe);

  return sendSuccess({
    res,
    statusCode: 201,
    data: client,
    message: "Client created successfully",
  });
};

export const getAllClients = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.GetAllClientsDto;
  const userId = req.user!.id;

  const data = await ClientService.getAll(userId, dataSafe);

  return sendSuccess({
    res,
    data,
  });
};

export const getDetailsClient = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.ClientDetailsDto;

  const clientData = await ClientService.getDetails(dataSafe);

  return sendSuccess({
    res,
    data: clientData,
  });
};

export const updateClient = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.UpdateClientDto;
  const userId = req.user!.id;

  const updatedClient = await ClientService.update(userId, dataSafe);

  return sendSuccess({
    res,
    data: updatedClient,
    message: "Client updated successfully",
  });
};

export const deleteClient = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.DeleteClientDto;
  const userId = req.user!.id;

  await ClientService.delete(userId, dataSafe);

  return sendSuccess({
    res,
    message: "Client deleted permanently",
  });
};
