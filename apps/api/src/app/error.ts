import type { Express } from "express";

import notFound from "@/shared/middleware/notFound";
import globalErrorHandler from "@/shared/middleware/globalErrorHandler";

export default function registerErrors(app: Express) {
  app.use(notFound);
  app.use(globalErrorHandler);
}