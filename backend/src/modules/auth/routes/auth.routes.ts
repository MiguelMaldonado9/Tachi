import type { FastifyInstance } from "fastify";

import { AuthController } from "../controllers/auth.controller.js";

export async function authRoutes(
  app: FastifyInstance,
) {
  const controller =
    new AuthController();

  app.post(
    "/register",
    controller.register.bind(controller),
  );

  app.post(
    "/login",
    controller.login.bind(controller),
  );
}