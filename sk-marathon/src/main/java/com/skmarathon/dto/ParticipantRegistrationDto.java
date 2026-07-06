// ==================== ParticipantRegistrationDto.java ====================
package com.skmarathon.dto;

import com.skmarathon.entity.RaceCategory;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * What a client is allowed to send when registering (or updating) a
 * participant. Deliberately excludes id, paymentStatus, registrationNumber
 * and startNumber - those are server-controlled only, and since they don't
 * exist as fields here, a client cannot set them no matter what extra JSON
 * they include in the request body (Jackson silently drops unknown fields).
 *
 * Reused for both registration and update, since both currently need the
 * exact same fields - see README for the reasoning.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ParticipantRegistrationDto {

    @NotBlank(message = "First Name is required")
    private String firstName;

    @NotBlank(message = "Last Name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address format provided.")
    private String email;

    // Enforces the spec's "age >= 16" requirement. Only takes effect where
    // the controller method also has @Valid.
    @NotNull(message = "Age is required")
    @Min(value = 16, message = "You must be at least 16 years old to register")
    private Integer age;

    @NotNull(message = "Category is required")
    private RaceCategory category;
}
