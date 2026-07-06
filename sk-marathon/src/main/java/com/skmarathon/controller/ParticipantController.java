package com.skmarathon.controller;

import com.skmarathon.dto.ParticipantPublicDto;
import com.skmarathon.dto.ParticipantRegistrationDto;
import com.skmarathon.dto.ParticipantResponseDto;
import com.skmarathon.dto.ParticipantStatusDto;
import com.skmarathon.entity.Participant;
import com.skmarathon.service.ParticipantServiceImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(maxAge = 3360)
@RestController
@RequestMapping("/participants")
public class ParticipantController {
    @Autowired
    private ParticipantServiceImpl participantService;

    // Public list of PAID participants only - powers the "Run With Us" page.
    // Returns ParticipantPublicDto (no email) since this is an unauthenticated,
    // public-facing endpoint - see ParticipantServiceImpl.getAllParticipants().
    @GetMapping
    public ResponseEntity<List<ParticipantPublicDto>> getParticipant() {
        return ResponseEntity.ok(participantService.getAllParticipants());
    }

    // General-purpose lookup by id (e.g. admin/debugging use). Returns the
    // raw entity - no client input to protect and no public-exposure concern
    // here, unlike the list endpoint above.
    @GetMapping("participant/{id}")
    public Participant getParticipantById(@PathVariable Long id) {
        return participantService.getParticipantById(id);
    }

    // GET /participants/status?email=...
    // GET /participants/status?registrationNumber=...
    // Exactly one of the two params is required - see checkStatus() in the
    // service layer for the validation and PAID/UNPAID branching logic.
    @GetMapping("/status")
    public ResponseEntity<ParticipantStatusDto> checkStatus(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String registrationNumber){
        return ResponseEntity.ok(participantService.checkStatus(email, registrationNumber));
    }

    // Registration entry point. @Valid triggers the Bean Validation
    // annotations declared on ParticipantRegistrationDto (age >= 16, required
    // fields, email format) - without it those annotations are inert.
    @PostMapping
    public ResponseEntity<ParticipantResponseDto> addParticipant(@Valid @RequestBody ParticipantRegistrationDto dto) {
        ParticipantResponseDto response = participantService.registerParticipant(dto);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Simulated payment attempt. No request body - the participant id in the
    // path is all that's needed. Returns 200 + ParticipantResponseDto on
    // success, or 402 (Payment Required) + the same DTO shape (with a
    // failure message) if the simulated payment happened to fail - see
    // simulatePayment()'s coin flip.
    @PostMapping("/{id}/pay")
    public ResponseEntity<ParticipantResponseDto> payForParticipant(@PathVariable Long id){
        ParticipantResponseDto response = participantService.simulatePayment(id);

        if(response.isPaymentStatus()){
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED).body(response);
        }
    }

    // Updates editable participant fields via the same DTO used for
    // registration, so a client can't smuggle in paymentStatus/startNumber
    // changes through an update request either.
    @PutMapping("update/{id}")
    public ResponseEntity<ParticipantResponseDto> updateParticipant(
            @Valid @RequestBody ParticipantRegistrationDto dto,
            @PathVariable Long id){

        ParticipantResponseDto response = participantService.updateParticipant(dto, id);
        return ResponseEntity.ok(response);
    }

    // Deleting a given participant based on the passed id.
    @DeleteMapping("delete/{id}")
    public void deleteParticipant(@PathVariable Long id){
        participantService.deleteParticipant(id);
    }

}
