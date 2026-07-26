import { NotFoundError, ConflictError } from "../../../shared/errors/index.js";
import { AuthRepository } from "../repositories/auth.repository.js";
import type { RegisterDTO } from "../dto/register.dto.js";

export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository = new AuthRepository(),
  ) {}

  async getCurrentUser(authId: string) {
    const user = await this.authRepository.findByAuthId(authId);

    if (!user) {
      throw new NotFoundError(
        "Usuario no encontrado",
        "USER_NOT_FOUND",
      );
    }

    return {
      user,
    };
  }

  async register(data: RegisterDTO) {

    const existingUser =
      await this.authRepository.findByEmail(
        data.email,
      );


    if (existingUser) {
      throw new ConflictError(
        "El usuario ya existe",
        "USER_ALREADY_EXISTS",
      );
    }


    const user =
      await this.authRepository.createUser(
        data,
      );


    return {
      user,
    };
  }
}