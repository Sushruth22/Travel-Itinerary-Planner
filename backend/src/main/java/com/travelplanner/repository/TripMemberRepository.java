package com.travelplanner.repository;

import com.travelplanner.entity.Trip;
import com.travelplanner.entity.TripMember;
import com.travelplanner.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TripMemberRepository extends JpaRepository<TripMember, UUID> {
    List<TripMember> findByTrip(Trip trip);
    List<TripMember> findByUser(User user);
    Optional<TripMember> findByTripAndUser(Trip trip, User user);
    boolean existsByTripAndUser(Trip trip, User user);
}
