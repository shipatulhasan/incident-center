import express from "express";

import registerMiddlewares from "./middleware";
import registerRoutes from "./routes";
import registerErrors from "./error";

const app = express();
app.get('/', (req, res) => res.json({
  message:'Hello from incident'
}))
registerMiddlewares(app);
registerRoutes(app)
registerErrors(app);



export default app;