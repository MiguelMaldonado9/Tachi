export enum UserRole {
  PASSENGER = "PASSENGER",
  DRIVER = "DRIVER",
  ADMIN = "ADMIN",
  SUPERVISOR = "SUPERVISOR",
}

export enum UserStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
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