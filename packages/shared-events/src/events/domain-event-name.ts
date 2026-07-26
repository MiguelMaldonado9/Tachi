export enum DomainEventName {
  // Auth
  USER_REGISTERED = "UserRegistered",
  USER_LOGGED_IN = "UserLoggedIn",
  USER_LOGGED_OUT = "UserLoggedOut",

  // Drivers
  DRIVER_APPLIED = "DriverApplied",
  DRIVER_APPROVED = "DriverApproved",
  DRIVER_REJECTED = "DriverRejected",
  DRIVER_ONLINE = "DriverOnline",
  DRIVER_OFFLINE = "DriverOffline",
  DRIVER_LOCATION_UPDATED = "DriverLocationUpdated",

  // Vehicles
  VEHICLE_REGISTERED = "VehicleRegistered",
  VEHICLE_ASSIGNED = "VehicleAssigned",
  VEHICLE_RELEASED = "VehicleReleased",

  // Trips
  TRIP_REQUESTED = "TripRequested",
  DRIVER_ASSIGNED = "DriverAssigned",
  DRIVER_ACCEPTED = "DriverAccepted",
  DRIVER_ARRIVED = "DriverArrived",
  TRIP_STARTED = "TripStarted",
  TRIP_COMPLETED = "TripCompleted",
  TRIP_CANCELLED = "TripCancelled",

  // Payments
  PAYMENT_CREATED = "PaymentCreated",
  PAYMENT_COMPLETED = "PaymentCompleted",
  PAYMENT_FAILED = "PaymentFailed",

  // Ratings
  RATING_CREATED = "RatingCreated",

  // Notifications
  NOTIFICATION_SENT = "NotificationSent",
}