
import authRoutes from "@/modules/auth/auth.routes";
import incidentRoutes from "@/modules/incident/incident.route";

import { App } from "@/shared/types/app";

const registerRoutes = (app: App) => {
   app.use("/api/auth", authRoutes);
   app.use("/api/incidents", incidentRoutes);

  // IncidentModule(app);
  // NotificationModule(app);
};

export default registerRoutes;