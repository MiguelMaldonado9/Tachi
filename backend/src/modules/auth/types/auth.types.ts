export enum UserRole {
  USER = "USER",
  DRIVER = "DRIVER",
  ADMIN = "ADMIN",
  SUPERVISOR = "SUPERVISOR",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export enum DriverStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  SUSPENDED = "SUSPENDED",
}

export interface CurrentUser {
  id: string;

  authId: string;

  email: string;

  roles: UserRole[];

  status: UserStatus;
}