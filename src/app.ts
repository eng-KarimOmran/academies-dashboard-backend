import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

import env from "./config/env";
import { notFound } from "./middlewares/notfound.middleware";
import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./middlewares/errors.middleware";
import router from "./routes/index.routes";
import "./jobs/cleanup";

const app: Application = express();

app.use(
  cors({
    origin: env.app.frontend,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server is running correctly! 🚀");
});

app.use("/api/v1", router);

router.use(notFound);

app.use(globalErrorHandler);

export default app;
