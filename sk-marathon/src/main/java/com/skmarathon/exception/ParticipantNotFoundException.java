// ==================== ParticipantNotFoundException.java ====================
package com.skmarathon.exception;

// Thrown when a lookup (by id, email, or registration number) finds nothing.
// Caught by CustomExceptionHandler and turned into a 404.

public class ParticipantNotFoundException extends RuntimeException {
    public ParticipantNotFoundException(String message) {
        super(message);
    }
}
