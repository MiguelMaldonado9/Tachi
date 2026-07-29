import {
  UserRole,
  UserStatus,
} from "../../auth/types/auth.types.js";

export interface UserDTO {

  id: string;

  authId: string;

  name: string;

  email: string;

  phone: string | null;

  photoUrl: string | null;

  roles: UserRole[];

  status: UserStatus;

}