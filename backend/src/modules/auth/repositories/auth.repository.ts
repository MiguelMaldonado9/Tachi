import type { AuthUserDto } from "../dto/auth-user.dto.js";
import type { RegisterDTO } from "../dto/register.dto.js";

import { UserStatus } from "../types/auth.types.js";

export class AuthRepository {

  async findByAuthId(
    authId: string,
  ): Promise<AuthUserDto | null> {

    void authId;

    // TODO:
    // Aquí consultaremos la tabla users en Supabase.

    return null;
  }


  async findByEmail(
    email: string,
  ): Promise<AuthUserDto | null> {

    void email;

    // TODO:
    // Buscar usuario por email en Supabase.

    return null;
  }


  async createUser(
    data: RegisterDTO,
  ): Promise<AuthUserDto> {

    void data;

    // TODO:
    // Crear usuario en Supabase.

    return {
      id: "temporary-id",
      authId: "temporary-auth-id",
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: null,
      photoUrl: null,
      roles: [],
      status: UserStatus.ACTIVE,
    };
  }
}