package com.travelplanner.repository;

import com.travelplanner.entity.Activity;
import com.travelplanner.entity.DayPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, UUID> {
    List<Activity> findByDayPlanOrderByStartTimeAsc(DayPlan dayPlan);
    
    @Query("SELECT SUM(a.cost) FROM Activity a WHERE a.dayPlan.trip.id = :tripId")
    BigDecimal getTotalCostByTripId(@Param("tripId") UUID tripId);
    
    @Query("SELECT a FROM Activity a WHERE a.dayPlan.trip.id = :tripId AND a.cost IS NOT NULL")
    List<Activity> findActivitiesWithCostByTripId(@Param("tripId") UUID tripId);
}
