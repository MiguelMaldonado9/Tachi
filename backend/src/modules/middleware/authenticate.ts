import type {
  FastifyReply,
  FastifyRequest,
} from "fastify";

import { jwtVerifier }
  from "../../lib/supabase/index.js";

import {
  UnauthorizedError,
} from "../../shared/errors/index.js";

export async function authenticate(
  request: FastifyRequest,
  _reply: FastifyReply,
) {

  const authorization =
    request.headers.authorization;

  if (!authorization) {

    throw new UnauthorizedError(
      "Token requerido",
      "TOKEN_REQUIRED",
    );

  }

  if (
    !authorization.startsWith(
      "Bearer ",
    )
  ) {

    throw new UnauthorizedError(
      "Formato de token inválido",
      "INVALID_TOKEN_FORMAT",
    );

  }

  const token =
    authorization.slice(7);

  request.user =
    await jwtVerifier.verify(
      token,
    );

}