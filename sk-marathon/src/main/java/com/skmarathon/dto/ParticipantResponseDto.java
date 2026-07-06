// ==================== ParticipantResponseDto.java ====================
package com.skmarathon.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Returned after registration, update, or a payment attempt. One shape
 * serves all three since they all need to communicate roughly the same
 * thing: identifiers plus a human-readable outcome message.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ParticipantResponseDto {

    private Long id;

    private String registrationNumber;

    // Null until payment succeeds.
    private String startNumber;

    private boolean paymentStatus;

    private String message;
}
