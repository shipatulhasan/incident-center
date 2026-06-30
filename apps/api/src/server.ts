import app from "./app";
import { envVars } from "./config/env";
import { connectDatabase } from "./config/database";

async function bootstrap() {
  try {
    await connectDatabase();

    app.listen(envVars.PORT, () => {
      console.log(
        `Server running on ${envVars.PORT}`
      );
    });
  } catch (error) {
    console.error(error);
  }
}

bootstrap();