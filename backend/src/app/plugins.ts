import { FastifyInstance } from "fastify";

import helmet from "@fastify/helmet";
import cors from "@fastify/cors";

export async function registerPlugins(app: FastifyInstance) {
  await app.register(helmet);

  await app.register(cors, {
    origin: true,
    credentials: true,
  });
}