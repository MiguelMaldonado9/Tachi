import type { FastifyReply, FastifyRequest } from "fastify";

import { AuthService } from "../services/auth.service.js";
import { registerSchema } from "../schemas/register.schema.js";
import { loginSchema } from "../schemas/login.schema.js";

export class AuthController {
  constructor(
    private readonly authService = new AuthService(),
  ) {}

  async register(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const data = registerSchema.parse(request.body);

    const result =
      await this.authService.register(data);

    return reply
      .status(201)
      .send({
        success: true,
        data: result,
      });
  }

  async login(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const data = loginSchema.parse(request.body);

    const result =
      await this.authService.login(data);

    return reply
      .status(200)
      .send({
        success: true,
        data: result,
      });
  }
}