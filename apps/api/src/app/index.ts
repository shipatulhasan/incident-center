import express from "express";

import registerMiddlewares from "./middleware";
import registerRoutes from "./routes";

const app = express();

registerMiddlewares(app);
registerRoutes(app)


export default app;