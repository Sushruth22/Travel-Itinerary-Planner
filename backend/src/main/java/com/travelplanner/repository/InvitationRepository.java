package com.travelplanner.repository;

import com.travelplanner.entity.Invitation;
import com.travelplanner.entity.Trip;
import com.travelplanner.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InvitationRepository extends JpaRepository<Invitation, UUID> {
    List<Invitation> findByTrip(Trip trip);
    List<Invitation> findByInvitee(User invitee);
    List<Invitation> findByInviter(User inviter);
    Optional<Invitation> findByToken(String token);
    List<Invitation> findByInviteeEmail(String email);
}
