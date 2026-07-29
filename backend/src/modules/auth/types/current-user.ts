import type { UserRole } from "./auth.types.js";

export interface CurrentUser {

  id: string;

  email: string;

  roles: UserRole[];

}