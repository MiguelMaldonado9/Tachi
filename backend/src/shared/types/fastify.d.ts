import "fastify";

import type { CurrentUser }
  from "../../modules/auth/types/current-user.js";

declare module "fastify" {

  interface FastifyRequest {

    user?: CurrentUser;

  }

}