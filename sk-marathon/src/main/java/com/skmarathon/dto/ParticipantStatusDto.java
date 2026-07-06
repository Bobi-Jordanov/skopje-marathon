// ==================== ParticipantStatusDto.java ====================
package com.skmarathon.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Dedicated response shape for the status-check endpoint, since the spec
 * requires a genuinely different response depending on payment state:
 *  - PAID   -> identifier holds the start number
 *  - UNPAID -> identifier holds the registration number (so the frontend can
 *              still identify the participant to trigger payment)
 *
 * id is included so the frontend can call the /pay endpoint directly from
 * the status-check page if the participant hasn't paid yet.
 */
@Data
@AllArgsConstructor
public class ParticipantStatusDto {

    private Long id;

    private String status;            // "PAID" or "UNPAID"

    private String identifier;        // startNumber if paid, registrationNumber if not

    private String message;
}