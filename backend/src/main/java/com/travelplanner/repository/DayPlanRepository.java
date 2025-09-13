package com.travelplanner.repository;

import com.travelplanner.entity.DayPlan;
import com.travelplanner.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DayPlanRepository extends JpaRepository<DayPlan, UUID> {
    List<DayPlan> findByTripOrderByDateAsc(Trip trip);
    Optional<DayPlan> findByTripAndDate(Trip trip, LocalDate date);
    List<DayPlan> findByTripAndDateBetween(Trip trip, LocalDate startDate, LocalDate endDate);
}
