import axios from "axios";
import type { ValidationErrorMap } from "../types/participant";

/**
 * The backend returns errors in a few different shapes depending on which
 * handler catches them (see CustomExceptionHandler):
 *  - Bean Validation failures:  { "age": "must be >= 16", "email": "..." }
 *  - Custom exceptions:         { "error": "Email already exists: ..." }
 *  - Spring default fallback:   { "message": "...", "status": 500, ... }
 * This helper normalizes all of them into a single readable string,
 * and also returns field-level errors separately when present, so a form
 * can highlight the specific inputs that failed validation.
 */
export interface ParsedApiError {
  message: string;
  fieldErrors: ValidationErrorMap | null;
}

export function parseApiError(err: unknown): ParsedApiError {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;

    if (data && typeof data === "object") {
      // Custom exception shape: { "error": string }
      if ("error" in data && typeof data.error === "string") {
        return { message: data.error, fieldErrors: null };
      }

      // Spring default fallback shape: { "message": "...", ... }
      if ("message" in data && typeof data.message === "string") {
        return { message: data.message, fieldErrors: null };
      }

      // Bean Validation shape: plain map of fieldName -> message
      const entries = Object.entries(data as Record<string, unknown>);
      const looksLikeFieldMap =
        entries.length > 0 && entries.every(([, v]) => typeof v === "string");

      if (looksLikeFieldMap) {
        const fieldErrors = data as ValidationErrorMap;
        const combined = Object.values(fieldErrors).join(" ");
        return { message: combined, fieldErrors };
      }
    }

    if (err.message) {
      return { message: err.message, fieldErrors: null };
    }
  }

  return { message: "Something went wrong. Please try again.", fieldErrors: null };
}
