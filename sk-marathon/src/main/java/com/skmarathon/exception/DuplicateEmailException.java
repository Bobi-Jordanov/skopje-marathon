// ==================== DuplicateEmailException.java ====================
package com.skmarathon.exception;

// Thrown at registration time when the email already exists in the DB.
// Caught by CustomExceptionHandler and turned into a 409 Conflict.
public class DuplicateEmailException extends RuntimeException {
    public DuplicateEmailException(String message) {
        super(message);
    }
}
