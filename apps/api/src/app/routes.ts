

import AuthModule from "@/modules/auth";
import { App } from "@/shared/types/app";

const registerRoutes = (app: App) => {
  AuthModule(app);

  // IncidentModule(app);
  // NotificationModule(app);
};

export default registerRoutes;