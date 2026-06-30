import express from "express";

import registerMiddlewares from "./middleware";

const app = express();

registerMiddlewares(app);


export default app;