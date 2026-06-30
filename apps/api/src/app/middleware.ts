import type { Express } from "express";

import cors from "cors";
import express from "express";
import morgan from "morgan";

import { envVars } from "@/config/env";

import notFound from "@/shared/middleware/notFound";
import globalErrorHandler from "@/shared/middleware/globalErrorHandler";

export default function registerMiddlewares(app: Express) {
  app.use(
    cors({
      origin: envVars.CLIENT_URL,
      credentials: true,
    })
  );

  app.use(express.json());

  app.use(morgan("dev"));

  app.use(notFound);

  app.use(globalErrorHandler);
}