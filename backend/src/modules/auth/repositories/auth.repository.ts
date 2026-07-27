import { supabase } from "../../../lib/supabase/index.js";
import { AuthMapper } from "../mappers/auth.mapper.js";
import {
  ConflictError,
  InternalServerError,
} from "../../../shared/errors/index.js";

import type { AuthUserDto } from "../dto/auth-user.dto.js";
import type { RegisterDTO } from "../dto/register.dto.js";

import { UserStatus } from "../types/auth.types.js";

export class AuthRepository {

  async findByAuthId(
    authId: string,
  ): Promise<AuthUserDto | null> {

    return this.getUserById(authId);

  }

  async findByEmail(
    email: string,
  ): Promise<AuthUserDto | null> {

    const { data, error } =
      await supabase.admin
        .from("users")
        .select(`
          id,
          email,
          full_name,
          phone,
          photo_url,
          status
        `)
        .eq("email", email)
        .maybeSingle();

    if (error || !data) {

      return null;

    }

    return {

      id: data.id,

      authId: data.id,

      name: data.full_name,

      email: data.email,

      phone: data.phone,

      photoUrl: data.photo_url,

      roles: [],

      status: data.status as UserStatus,

    };

  }

  async createUser(
    data: RegisterDTO,
  ): Promise<AuthUserDto> {

    const {
      data: authUser,
      error,
    } = await supabase.admin.auth.admin.createUser({

      email: data.email,

      password: data.password,

      email_confirm: true,

      user_metadata: {

        full_name:
          `${data.firstName} ${data.lastName}`,

      },

    });

    if (error) {

      if (
        error.message.includes(
          "already been registered",
        )
      ) {

        throw new ConflictError(
          "El correo ya está registrado",
          "EMAIL_ALREADY_EXISTS",
        );

      }

      throw new InternalServerError(
        error.message,
      );

    }

    const user =
      await this.getUserById(
        authUser.user.id,
      );

    if (!user) {

      throw new InternalServerError(
        "No fue posible obtener el usuario creado.",
      );

    }

    return user;

  }

  private async getUserById(
    id: string,
  ): Promise<AuthUserDto | null> {

    const { data, error } =
      await supabase.admin
        .from("users")
        .select(`
          id,
          email,
          full_name,
          phone,
          photo_url,
          status
        `)
        .eq("id", id)
        .maybeSingle();

    if (error || !data) {

      return null;

    }

    return {

      id: data.id,

      authId: data.id,

      name: data.full_name,

      email: data.email,

      phone: data.phone,

      photoUrl: data.photo_url,

      roles: [],

      status: data.status as UserStatus,

    };

  }

}