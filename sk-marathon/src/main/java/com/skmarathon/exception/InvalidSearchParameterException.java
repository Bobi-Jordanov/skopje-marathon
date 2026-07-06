// ==================== InvalidSearchParameterException.java ====================
package com.skmarathon.exception;

// Thrown by checkStatus() when the caller provides neither email nor
// registrationNumber, or provides both at once (ambiguous - see
// ParticipantServiceImpl.checkStatus for the exact rules).
// Caught by CustomExceptionHandler and turned into a 400.

public class InvalidSearchParameterException extends RuntimeException {
    public InvalidSearchParameterException(String message) {

        super(message);
    }
}
