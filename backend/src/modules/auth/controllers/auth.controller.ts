import type { FastifyReply, FastifyRequest } from "fastify";

import { AuthService } from "../services/auth.service.js";
import { registerSchema } from "../schemas/register.schema.js";

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
}