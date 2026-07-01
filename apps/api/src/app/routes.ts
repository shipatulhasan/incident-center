
import authRoutes from "@/modules/auth/auth.routes";

import { App } from "@/shared/types/app";

const registerRoutes = (app: App) => {
   app.use("/api/auth", authRoutes);

  // IncidentModule(app);
  // NotificationModule(app);
};

export default registerRoutes;