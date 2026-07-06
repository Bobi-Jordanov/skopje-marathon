package com.skmarathon.service;

import com.skmarathon.dto.ParticipantPublicDto;
import com.skmarathon.dto.ParticipantRegistrationDto;
import com.skmarathon.dto.ParticipantResponseDto;
import com.skmarathon.dto.ParticipantStatusDto;
import com.skmarathon.entity.Participant;

import java.util.List;

public interface ParticipantService {

    List<ParticipantPublicDto> getAllParticipants();

    Participant getParticipantById(Long id);

    // Participant addParticipant(Participant participant);

    ParticipantResponseDto updateParticipant(ParticipantRegistrationDto dto, Long id);

    void deleteParticipant(Long id);

    ParticipantResponseDto simulatePayment(Long id);

    ParticipantStatusDto checkStatus(String email, String registrationNumber);

    ParticipantResponseDto registerParticipant(ParticipantRegistrationDto dto);
}
