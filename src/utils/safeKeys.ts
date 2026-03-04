import { Prisma } from "../../generated/prisma/client";

type SelectFields = {
  user: Array<keyof Prisma.UserSelect>;
  captain: Array<keyof Prisma.CaptainSelect>;
  secretary: Array<keyof Prisma.SecretarySelect>;
  car: Array<keyof Prisma.CarSelect>;
  subscription: Array<keyof Prisma.SubscriptionSelect>;
  payment: Array<keyof Prisma.PaymentTransactionSelect>;
  lesson: Array<keyof Prisma.LessonSelect>;
  area: Array<keyof Prisma.AreaSelect>;
  client: Array<keyof Prisma.ClientSelect>;
};

export const fieldsToSelect: SelectFields = {
  user: ["id", "name", "phone", "role", "status", "createdAt"],
  captain: ["id", "isActive", "captainLessonPrice", "trainingType"],
  secretary: ["id", "baseSalary", "targetCount", "bonusAmount"],
  car: [
    "id",
    "modelName",
    "plateNumber",
    "gearType",
    "carSessionPrice",
    "isActive",
    "createdAt",
  ],
  subscription: ["id", "status", "trainingTypeAtRegistration", "createdAt"],
  payment: [
    "id",
    "amount",
    "createdAt",
    "paymentMethod",
    "referenceNumber",
    "status",
    "type",
  ],
  lesson: [
    "id",
    "captainLessonPrice",
    "carSessionPrice",
    "endTime",
    "expectedAmount",
    "startTime",
    "status",
    "transmission",
  ],
  area: ["id", "name", "isActive", "supportType"],
  client: ["id", "createdAt", "name", "phone"],
};

export const selectSafeKeys = <
  M extends keyof typeof fieldsToSelect,
  T extends (typeof fieldsToSelect)[M][number],
>(
  model: M,
) => {
  const fields = fieldsToSelect[model];
  const selectObj = fields.reduce(
    (acc, field) => {
      (acc as any)[field] = true;
      return acc;
    },
    {} as Record<string, boolean>,
  );
  return selectObj as unknown as { [K in T]: true };
};
