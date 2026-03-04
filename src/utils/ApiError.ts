import ErrorResponse from "./errorResponse";
import { ModelName } from "../../generated/prisma/internal/prismaNamespace";

type UniqueField =
  | "Phone"
  | "Name"
  | "Email"
  | "LicensePlate"
  | "CaptainProfile"
  | "SecretaryProfile"
  | "NationalId"
  | "RoleConflict"
  | "EXCESS_REFUND"
  | "OVERPAYMENT"
  | "SubscriptionAlreadyCancelled"
  | "CaptainTimeConflict"
  | "CarTimeConflict"
  | "ClientTimeConflict";

class ApiError {
  static NotFound(model: ModelName) {
    const messages: Record<ModelName, string> = {
      User: "User not found",
      BlacklistedToken: "Token is invalid or expired",
      Academy: "Academy not found",
      SocialMedia: "Social media platform not found",
      Secretary: "Secretary not found",
      Captain: "Captain not found",
      Car: "Car not found",
      Area: "Area not found",
      Client: "Client not found",
      Subscription: "Subscription not found",
      PaymentTransaction: "Payment transaction not found",
      Course: "Course not found",
      Lesson: "Lesson not found",
      SubscriptionCancellation: "Cancellation request not found",
      Expense: "Expense record not found",
    };

    const message = messages[model] || "Requested record not found";
    return new ErrorResponse(message, 404);
  }

  // --- 409 Conflict Errors ---
  static Conflict(field: UniqueField) {
    const messages: Record<UniqueField, string> = {
      Phone: "This phone number is already registered",
      Name: "This name is already taken",
      Email: "This email address is already in use",
      LicensePlate: "This license plate is already registered to a car",
      CaptainProfile: "This user already has a captain profile",
      SecretaryProfile: "This user already has a secretary profile",
      NationalId: "This national ID is already registered",
      RoleConflict:
        "User cannot hold both Captain and Secretary roles simultaneously",

      OVERPAYMENT: "Payment amount exceeds the remaining balance due",
      EXCESS_REFUND: "Refund amount exceeds the total paid amount",

      SubscriptionAlreadyCancelled:
        "This subscription has already been cancelled.",

      CaptainTimeConflict: "Captain is already booked at this time.",

      CarTimeConflict: "Car is already booked at this time.",

      ClientTimeConflict: "Client already has a lesson booked at this time.",
    };

    const message = messages[field] || "Conflict occurred";
    return new ErrorResponse(message, 409);
  }

  // --- 403 Forbidden ---
  static Forbidden(
    message: string = "Access denied: insufficient permissions",
  ) {
    return new ErrorResponse(message, 403);
  }

  static AccountBlocked() {
    return new ErrorResponse(
      "This account is blocked. Please contact admin",
      403,
    );
  }

  // --- 401 Unauthorized ---
  static Unauthorized(message: string = "Authentication required") {
    return new ErrorResponse(message, 401);
  }

  // --- 422 & 400 ---
  static ValidationError(message: string) {
    return new ErrorResponse(message, 422);
  }

  static BadRequest(message: string) {
    return new ErrorResponse(message, 400);
  }

  // --- 400 Inactive Error ---
  static Inactive(model: "Course" | "Captain" | "Car" | "Area") {
    const messages: Partial<Record<ModelName, string>> = {
      Course: "This course is currently inactive.",
      Captain: "This captain is currently inactive.",
      Car: "This car is currently inactive.",
      Area: "This area is currently inactive.",
    };

    const message = messages[model] || `${model} is currently inactive`;
    return new ErrorResponse(message, 400);
  }

  // --- 500 Internal ---
  static Internal() {
    return new ErrorResponse("An unexpected server error occurred", 500);
  }
}

export default ApiError;
