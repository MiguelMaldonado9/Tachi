import {
  createRemoteJWKSet,
  jwtVerify,
  type JWTPayload,
} from "jose";

import { env } from "../../config/index.js";

import type { CurrentUser }
  from "../../modules/auth/types/current-user.js";

import {
  UnauthorizedError,
} from "../../shared/errors/index.js";

export class JwtVerifier {

  private readonly jwks;

  constructor() {

    this.jwks = createRemoteJWKSet(

      new URL(
        `${env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`,
      ),

    );

  }

  async verify(
    token: string,
  ): Promise<CurrentUser> {

    try {

      const { payload } =
        await jwtVerify(
          token,
          this.jwks,
          {
            issuer:
              env.SUPABASE_JWT_ISSUER,
          },
        );

      return this.mapPayload(
        payload,
      );

    } catch {

      throw new UnauthorizedError(
        "Token inválido o expirado",
        "INVALID_TOKEN",
      );

    }

  }

  private mapPayload(
    payload: JWTPayload,
  ): CurrentUser {

    return {

      id: payload.sub ?? "",

      email:
        String(payload.email ?? ""),

      roles: [],

    };

  }

}

export const jwtVerifier =
  new JwtVerifier();