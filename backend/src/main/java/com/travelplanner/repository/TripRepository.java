package com.travelplanner.repository;

import com.travelplanner.entity.Trip;
import com.travelplanner.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface TripRepository extends JpaRepository<Trip, UUID> {
    Page<Trip> findByUser(User user, Pageable pageable);
    
    @Query("SELECT t FROM Trip t JOIN t.members tm WHERE tm.user = :user")
    Page<Trip> findByMemberUser(@Param("user") User user, Pageable pageable);
    
    @Query("SELECT t FROM Trip t WHERE t.user = :user OR t IN (SELECT tm.trip FROM TripMember tm WHERE tm.user = :user)")
    Page<Trip> findByUserOrMember(@Param("user") User user, Pageable pageable);
    
    List<Trip> findByUserAndStartDateBetween(User user, LocalDate startDate, LocalDate endDate);
    
    Page<Trip> findByIsPublicTrueAndTitleContainingIgnoreCase(String title, Pageable pageable);
}
