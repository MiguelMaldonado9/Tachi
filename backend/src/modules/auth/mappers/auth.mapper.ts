import type { User } from "@supabase/supabase-js";

import type { AuthUserDto } from "../dto/auth-user.dto.js";

import { 
    UserStatus
} from "../types/auth.types.js";

export class AuthMapper {

  static toDto(user: User): AuthUserDto {

    return {

      id: user.id,

      authId: user.id,

      email: user.email ?? "",

      name:
        user.user_metadata.full_name ?? "",

      phone: null,

      photoUrl: null,

      roles: [],

      status: UserStatus.PENDING,

    };

  }

}