import { supabase } 
  from "../../../lib/supabase/index.js";

import {
  ConflictError,
  InternalServerError,
  UnauthorizedError,
} from "../../../shared/errors/index.js";

import type { UserDTO }
  from "../../users/dto/user.dto.js";

import type { RegisterDTO } 
  from "../dto/register.dto.js";

import type { LoginDTO } 
  from "../dto/login.dto.js";

import type { LoginResponseDTO } 
  from "../dto/login-response.dto.js";

import { UserStatus } 
  from "../types/auth.types.js";

import { UserRepository }
  from "../../users/repositories/user.repository.js";

export class AuthRepository {

  private readonly userRepository =
    new UserRepository();


  async createUser(
    data: RegisterDTO,
  ): Promise<UserDTO> {

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
      await this.userRepository.findById(
        authUser.user.id,
      );

    if (!user) {

      throw new InternalServerError(
        "No fue posible obtener el usuario creado.",
      );

    }

    return user;

  }


  async login(
    data: LoginDTO,
  ): Promise<LoginResponseDTO> {

    const {
      data: sessionData,
      error,
    } =
      await supabase.client.auth.signInWithPassword({

        email: data.email,

        password: data.password,

      });

    if (
      error ||
      !sessionData.user ||
      !sessionData.session
    ) {

      throw new UnauthorizedError(
        "Correo o contraseña incorrectos.",
        "INVALID_CREDENTIALS",
      );

    }

    const user =
      await this.userRepository.findById(
        sessionData.user.id,
      );

    if (!user) {

      throw new InternalServerError(
        "Usuario no encontrado después del login.",
      );

    }

    return {

      user,

      session: {

        accessToken:
          sessionData.session.access_token,

        refreshToken:
          sessionData.session.refresh_token,

        expiresIn:
          sessionData.session.expires_in,

      },

    };

  }

}