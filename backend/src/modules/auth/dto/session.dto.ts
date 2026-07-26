import { AuthUserDto } from "./auth-user.dto.js";

export interface SessionDto {
  user: AuthUserDto;

  accessToken?: string;

  refreshToken?: string;
}