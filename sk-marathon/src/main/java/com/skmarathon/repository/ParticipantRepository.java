package com.skmarathon.repository;

import com.skmarathon.entity.Participant;
import jakarta.servlet.http.Part;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Long> {
    Optional<Participant> findByEmail(String email);

    Optional<Participant> findByRegistrationNumber(String registrationNumber);

    long countByPaymentStatusTrue();

    boolean existsByEmail(String email);
}
