package com.skmarathon.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * Centralized exception handling for the whole API. Without this,
 * uncaught exceptions fall through to Spring's default error page (a full
 * stack trace + generic 500), regardless of what actually went wrong.
 * Each handler here maps a specific exception type to the correct HTTP
 * status and a clean, minimal JSON body.
 */
@RestControllerAdvice
public class CustomExceptionHandler{
    // Catches Bean Validation failures (triggered by @Valid on a controller
    // parameter). Returns every failed field with its specific message,
    // e.g. {"age": "must be >= 16", "email": "must be a well-formed..."} -
    // so the frontend can highlight all invalid fields at once rather than
    // one at a time.
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleExceptniot(MethodArgumentNotValidException ex){
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

        return errors;
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(ParticipantNotFoundException.class)
    public Map<String, String> userNotFound(ParticipantNotFoundException ex){
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());

        return error;
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(InvalidSearchParameterException.class)
    public Map<String, String> handleMissingParam(InvalidSearchParameterException ex){
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());

        return error;
    }

    @ResponseStatus(HttpStatus.CONFLICT)
    @ExceptionHandler(DuplicateEmailException.class)
    public Map<String, String> handleDuplicateEmail(DuplicateEmailException ex){
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());

        return error;
    }


}
