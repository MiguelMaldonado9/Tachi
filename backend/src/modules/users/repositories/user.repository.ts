import { supabase } from "../../../lib/supabase/index.js";

import { InternalServerError } from "../../../shared/errors/index.js";

import type { UserDTO } from "../dto/user.dto.js";

import { UserStatus } from "../../auth/types/auth.types.js";


const USER_SELECT = `
  id,
  email,
  full_name,
  phone,
  photo_url,
  status
`;

type UserRow = {

  id: string;

  email: string;

  full_name: string;

  phone: string | null;

  photo_url: string | null;

  status: string;

};

export class UserRepository {

  async findById(
    id: string,
  ): Promise<UserDTO | null> {

    const { data, error } =
      await supabase.admin
        .from("users")
        .select(USER_SELECT)
        .eq("id", id)
        .maybeSingle();

    if (error || !data) {

      return null;

    }

    return this.mapUser(data);

  }

  async findByEmail(
    email: string,
  ): Promise<UserDTO | null> {

    const { data, error } =
      await supabase.admin
        .from("users")
        .select(USER_SELECT)
        .eq("email", email)
        .maybeSingle();

    if (error || !data) {

      return null;

    }

    return this.mapUser(data);

  }

    async existsByEmail(
      email: string,
    ): Promise<boolean> {

      const { count, error } =
        await supabase.admin
          .from("users")
          .select(
            "id",
            {
              count: "exact",
              head: true,
            },
          )
          .eq("email", email);

      if (error) {

        throw new InternalServerError(
          error.message,
        );

      }

      return (count ?? 0) > 0;

    }

    async existsById(
      id: string,
    ): Promise<boolean> {

      const { count, error } =
        await supabase.admin
          .from("users")
          .select(
            "id",
            {
              count: "exact",
              head: true,
            },
          )
          .eq("id", id);

      if (error) {

        throw new InternalServerError(
          error.message,
        );

      }

      return (count ?? 0) > 0;

    }


  private mapUser(
    data: UserRow,
  ): UserDTO {

    return {

      id: data.id,

      authId: data.id,

      name: data.full_name,

      email: data.email,

      phone: data.phone,

      photoUrl: data.photo_url,

      roles: [],

      //TODO:
      // Obtener roles desde la tabla user_roles

      status: data.status as UserStatus,

    };

  }

}