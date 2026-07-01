
import { App } from "@/shared/types/app";
import authRoutes from "./auth.routes";

const AuthModule = (app: App) => {
  app.use("/api/auth", authRoutes);
};

export default AuthModule;