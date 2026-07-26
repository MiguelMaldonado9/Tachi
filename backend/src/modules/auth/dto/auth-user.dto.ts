import { UserRole, UserStatus } from "../types/auth.types.js";

export interface AuthUserDto {
  id: string;

  authId: string;

  name: string;

  email: string;

  phone: string | null;

  photoUrl: string | null;

  roles: UserRole[];

  status: UserStatus;
}