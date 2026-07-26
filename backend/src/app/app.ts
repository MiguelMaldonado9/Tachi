import Fastify from "fastify";


import { registerPlugins } from "./plugins.js";
import { registerRoutes } from "./routes.js";
import { logger } from "../config/logger.js";
import { registerErrorHandler } from "../shared/errors/error-handler.js";

export async function buildApp() {
  const app = Fastify({
    logger,
  });

  registerErrorHandler(app);

  await registerPlugins(app);

  await registerRoutes(app);

  return app;
}