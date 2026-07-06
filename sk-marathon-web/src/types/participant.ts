// Mirrors backend enum RaceCategory
export type RaceCategory = "FIVE_KM" | "TEN_KM" | "HALF_MARATHON" | "MARATHON";

export const CATEGORY_LABELS: Record<RaceCategory, string> = {
  FIVE_KM: "5 km",
  TEN_KM: "10 km",
  HALF_MARATHON: "Half Marathon",
  MARATHON: "Marathon",
};

export const CATEGORY_OPTIONS: RaceCategory[] = [
  "FIVE_KM",
  "TEN_KM",
  "HALF_MARATHON",
  "MARATHON",
];

// Mirrors backend: ParticipantRegistrationDto
export interface ParticipantRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  age: number | "";
  category: RaceCategory | "";
}

// Mirrors backend: ParticipantResponseDto
export interface ParticipantResponseDto {
  id: number;
  registrationNumber: string;
  startNumber: string | null;
  paymentStatus: boolean;
  message: string;
}

// Mirrors backend: ParticipantStatusDto
export interface ParticipantStatusDto {
  id: number;
  status: "PAID" | "UNPAID";
  identifier: string;
  message: string;
}

// Mirrors backend: ParticipantPublicDto (the public-facing shape)
export interface ParticipantPublicDto {
  id: number;
  firstName: string;
  lastName: string;
  age: number | "";
  category: RaceCategory;
  startNumber: string;
}

// Shape of Spring's validation error map response,
// { "age": "must be...", "email": "..." }
export type ValidationErrorMap = Record<string, string>;

// Shape of the { "error": "..." } responses from CustomExceptionHandler
export interface ApiErrorResponse {
  error?: string;
  message?: string;
}
