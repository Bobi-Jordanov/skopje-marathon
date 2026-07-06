// ==================== ParticipantPublicDto.java ====================
package com.skmarathon.dto;

import com.skmarathon.entity.RaceCategory;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Trimmed, public-facing shape for the "Run With Us" list. Deliberately
 * excludes email - this endpoint is unauthenticated, so personal contact
 * details should never be exposed here even though the underlying entity
 * has them. Age is currently still present; consider dropping it too if it
 * isn't actually shown on the public page.
 *
 * NOTE: not yet wired into ParticipantController.getParticipant() - that
 * endpoint currently still returns the raw Participant entity. Migrating it
 * to return this DTO instead is a known follow-up.
 */
@Data
@AllArgsConstructor
@NotBlank
public class ParticipantPublicDto {
    private Long id;

    private String firstName;

    private String lastName;

    private Integer age;

    private String startNumber;

    private RaceCategory category;
}
