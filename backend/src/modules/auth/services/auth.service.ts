import { NotFoundError, ConflictError } from "../../../shared/errors/index.js";
import { AuthRepository } from "../repositories/auth.repository.js";
import { UserRepository } from "../../users/repositories/user.repository.js";
import type { RegisterDTO } from "../dto/register.dto.js";
import type { LoginDTO } from "../dto/login.dto.js";

export class AuthService {
  constructor(
    private readonly authRepository = new AuthRepository(),
    private readonly userRepository = new UserRepository(),
  ) {}

  async getCurrentUser(authId: string) {
    const user = 
      await this.userRepository.findById(authId);

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

  async register(
    data: RegisterDTO,
  ) {

    const exists =
      await this.userRepository.existsByEmail(
        data.email,
      );

    if (exists) {

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
  async login(data: LoginDTO) {

    return this.authRepository.login(data);
  }
}