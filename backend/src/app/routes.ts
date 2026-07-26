import { FastifyInstance } from "fastify";
import { authRoutes } from "../modules/auth/index.js";

export async function registerRoutes(app: FastifyInstance) {
  app.get("/health", async () => {
    return {
      status: "ok",
      service: "tachi-backend",
      version: "0.1.0",
      timestamp: new Date().toISOString(),
    };
  });

  await app.register(authRoutes, {
    prefix: "/auth",
  });

}