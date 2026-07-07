
import authRoutes from "@/modules/auth/auth.routes";
import incidentRoutes from "@/modules/incident/incident.route";
import notifcation from "@/modules/notification/notification.route";

import { App } from "@/shared/types/app";

const registerRoutes = (app: App) => {
   app.use("/api/auth", authRoutes);
   app.use("/api/incidents", incidentRoutes);
   app.use("/api/notifications", notifcation);

  // IncidentModule(app);
  // NotificationModule(app);
};

export default registerRoutes;