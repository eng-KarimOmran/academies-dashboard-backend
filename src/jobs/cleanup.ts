import cron from "node-cron";
import dayjs from "dayjs";
import prisma from "../lib/prisma";

cron.schedule("0 0 * * *", async () => {
  try {
    const deleted = await prisma.invalidToken.deleteMany({
      where: {
        expiresAt: {
          lt: dayjs().toDate(),
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
});
