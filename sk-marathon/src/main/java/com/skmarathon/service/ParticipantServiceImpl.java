package com.skmarathon.service;

import com.skmarathon.dto.ParticipantPublicDto;
import com.skmarathon.dto.ParticipantRegistrationDto;
import com.skmarathon.dto.ParticipantResponseDto;
import com.skmarathon.dto.ParticipantStatusDto;
import com.skmarathon.entity.Participant;
import com.skmarathon.exception.DuplicateEmailException;
import com.skmarathon.exception.InvalidSearchParameterException;
import com.skmarathon.exception.ParticipantNotFoundException;
import com.skmarathon.repository.ParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ParticipantServiceImpl implements ParticipantService {
    @Autowired
    private ParticipantRepository participantRepository;

    /**
     * Public list of participants, powering the "Run With Us" page.
     * Filtered to paid participants only - registered-but-unpaid people
     * haven't secured their spot and shouldn't appear on a public "who's
     * running" showcase. Maps to ParticipantPublicDto rather than returning
     * the entity directly, since this endpoint is unauthenticated: email
     * (and arguably age) has no business being exposed here.
     */
    @Override
    public List<ParticipantPublicDto> getAllParticipants() {
        return participantRepository.findAll()
                .stream()
                .filter(Participant::isPaymentStatus)
                .map(p -> new ParticipantPublicDto(
                        p.getId(),
                        p.getFirstName(),
                        p.getLastName(),
                        p.getAge(),
                        p.getStartNumber(),
                        p.getCategory()
                ))
                .toList();
    }

    /**
     * General-purpose single lookup (e.g. admin/debugging use). Returns the
     * raw entity rather than a DTO - unlike the public list above, there's no
     * client input to protect here and no public-exposure concern, so the
     * usual DTO justification doesn't apply as strongly.
     */
    @Override
    public Participant getParticipantById(Long id) {
        return participantRepository.findById(id)
                .orElseThrow(() -> new ParticipantNotFoundException("Sorry, no participant found with an id of: " + id));
    }

//    @Override
//    public Participant addParticipant(Participant participant) {
//        participant.setRegistrationNumber(generateRegistrationNumber());
//        participant.setPaymentStatus(false);
//
//        return participantRepository.save(participant);
//    }

    /**
     * Updates a participant's editable details.
     * Takes a ParticipantRegistrationDto (not the entity) so a client can only
     * ever change firstName/lastName/email/age/category - fields like
     * paymentStatus, startNumber and registrationNumber are never touched here,
     * since they don't exist on this DTO at all.
     */
    @Override
    public ParticipantResponseDto updateParticipant(ParticipantRegistrationDto dto, Long id) {
        Participant pt = participantRepository.findById(id)
                        .orElseThrow(() -> new ParticipantNotFoundException("Participant not found with id: " + id));

        pt.setFirstName(dto.getFirstName());
        pt.setLastName(dto.getLastName());
        pt.setAge(dto.getAge());
        pt.setEmail(dto.getEmail());
        pt.setCategory(dto.getCategory());

        Participant updated = participantRepository.save(pt);

        return new ParticipantResponseDto(
                updated.getId(),
                updated.getRegistrationNumber(),
                updated.getStartNumber(),
                updated.isPaymentStatus(),
                "Update was successful"
        );
    }

    /**
     * Deletes a participant based on the passed ID,
     * if the participant exist, it gets deleted from the DB,
     * otherwise a ParticipantNotFoundException will be thrown.
    * */
    @Override
    public void deleteParticipant(Long id) {
        if(!participantRepository.existsById(id)){
            throw new ParticipantNotFoundException("Sorry, participant does not exist!");
        }
        participantRepository.deleteById(id);
    }

    /**
     * Simulates a race-fee payment attempt.
     * This is intentionally NOT guaranteed to succeed - the spec calls for a
     * simulation that "can be successful or unsuccessful", mirroring how a
     * real payment gateway might decline a charge. A coin flip stands in for
     * that uncertainty. Only on success is the participant marked paid and
     * issued a start number.
     *
     * Returns a ParticipantResponseDto either way (success or failure) rather
     * than the raw entity, so the controller/frontend get a consistent shape
     * and a human-readable outcome message regardless of which branch ran.
     */
    @Override
    public ParticipantResponseDto simulatePayment(Long id){
        Participant participant = getParticipantById(id);

        boolean success = Math.random() > 0.5;

        if(success){
            participant.setPaymentStatus(true);
            participant.setStartNumber(generateStartNumber());
            Participant saved = participantRepository.save(participant);

            return new ParticipantResponseDto(
                    saved.getId(),
                    saved.getRegistrationNumber(),
                    saved.getStartNumber(),
                    saved.isPaymentStatus(),
                    "Payment successful"
            );
        }

        return new ParticipantResponseDto(
                participant.getId(),
                participant.getRegistrationNumber(),
                participant.getStartNumber(),
                participant.isPaymentStatus(),
                "Payment failed, please try again"
        );
    }

    /**
     * Looks up a participant by email OR registration number (not both, and
     * not neither) and returns a status DTO whose shape depends on whether
     * they've paid:
     *  - paid    -> "PAID"   + their start number
     *  - unpaid  -> "UNPAID" + their registration number (so they can still
     *               be identified in order to complete payment)
     *
     * id is included in the DTO so the frontend can trigger payment directly
     * from the status-check page when the result is UNPAID.
     */
    @Override
    public ParticipantStatusDto checkStatus(String email, String registrationNumber){
        Participant participant;

        if ((email != null && !email.isBlank()) &&
                (registrationNumber != null && !registrationNumber.isBlank())) {
            throw new InvalidSearchParameterException("Please provide either an email or a registration number, not both");
        }

        if(email != null && !email.isBlank()){
            participant = participantRepository.findByEmail(email)
                    .orElseThrow(() -> new ParticipantNotFoundException("No participant found with the email: " + email));

        } else if(registrationNumber != null && !registrationNumber.isBlank()){
            participant = participantRepository.findByRegistrationNumber(registrationNumber)
                    .orElseThrow(() -> new ParticipantNotFoundException("No participant found with the registration number: " + registrationNumber));

        } else {
            throw new InvalidSearchParameterException("You must provide either an email or a registration number");
        }

        if(participant.isPaymentStatus()){
            return new ParticipantStatusDto(participant.getId(),"PAID", participant.getStartNumber(), "Successful registration");

        } else {
            return new ParticipantStatusDto(participant.getId(),"UNPAID", participant.getRegistrationNumber(), "Payment required, please complete your payment");
        }

    }

    // POST method of registering a single participant through a DTO
    /**
     * Registers a new participant from a ParticipantRegistrationDto.
     * Email uniqueness is enforced here (the spec's other validation rule,
     * age >= 16, is enforced declaratively via @Min on the DTO + @Valid on
     * the controller). paymentStatus is always initialized to false and a
     * registration number is always generated server-side - neither can be
     * influenced by the client, since ParticipantRegistrationDto has no
     * fields for them.
     */
    @Override
    public ParticipantResponseDto registerParticipant(ParticipantRegistrationDto dto){
        if(participantRepository.existsByEmail(dto.getEmail())){
            throw new DuplicateEmailException("Email already exists: " + dto.getEmail());
        }

        Participant participant = new Participant();

        participant.setFirstName(dto.getFirstName());
        participant.setLastName(dto.getLastName());
        participant.setEmail(dto.getEmail());
        participant.setAge(dto.getAge());
        participant.setCategory(dto.getCategory());
        participant.setRegistrationNumber(generateRegistrationNumber());
        participant.setPaymentStatus(false);

        Participant saved = participantRepository.save(participant);

        return new ParticipantResponseDto(
                saved.getId(),
                saved.getRegistrationNumber(),
                saved.getStartNumber(),
                saved.isPaymentStatus(),
                "Registration successful"
        );
    }

    // Unique-enough lookup key generated at registration time, before payment.
    // Format/uniqueness guaranteed by UUID; not intended to be human-memorable.
    private String generateRegistrationNumber(){
        return "REG-" + UUID.randomUUID().toString().substring(0,8).toUpperCase();
    }

    // Sequential 4-digit numbers are assigned only on successful payment,
    // based on how many participants have paid so far.
    private String generateStartNumber(){
        long paidCount = participantRepository.countByPaymentStatusTrue();
        return String.format("%04d", paidCount + 1);
    }

//    private String generateStartNumber(Long participantId){
//        return "SN-" + participantId;
//    }

}
