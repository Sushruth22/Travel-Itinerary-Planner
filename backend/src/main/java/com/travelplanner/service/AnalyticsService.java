package com.travelplanner.service;

import com.travelplanner.dto.analytics.CostBreakdownResponse;
import com.travelplanner.entity.Activity;
import com.travelplanner.entity.Trip;
import com.travelplanner.entity.User;
import com.travelplanner.repository.ActivityRepository;
import com.travelplanner.repository.TripMemberRepository;
import com.travelplanner.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class AnalyticsService {

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private TripMemberRepository tripMemberRepository;

    public CostBreakdownResponse getTripCostBreakdown(UUID tripId, User user) {
        Trip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));

        if (!hasAccessToTrip(trip, user)) {
            throw new AccessDeniedException("You don't have access to this trip");
        }

        List<Activity> activitiesWithCost = activityRepository.findActivitiesWithCostByTripId(tripId);
        BigDecimal totalCost = activityRepository.getTotalCostByTripId(tripId);
        
        if (totalCost == null) {
            totalCost = BigDecimal.ZERO;
        }

        // Calculate cost by category
        Map<Activity.ActivityCategory, BigDecimal> costByCategory = new HashMap<>();
        for (Activity activity : activitiesWithCost) {
            if (activity.getCategory() != null && activity.getCost() != null) {
                costByCategory.merge(activity.getCategory(), activity.getCost(), BigDecimal::add);
            }
        }

        // Calculate cost by day
        Map<String, BigDecimal> costByDay = new HashMap<>();
        for (Activity activity : activitiesWithCost) {
            if (activity.getCost() != null) {
                String dayKey = activity.getDayPlan().getDate().toString();
                costByDay.merge(dayKey, activity.getCost(), BigDecimal::add);
            }
        }

        // Get total activity count for the trip
        int totalActivities = trip.getDayPlans().stream()
            .mapToInt(dayPlan -> dayPlan.getActivities().size())
            .sum();

        return new CostBreakdownResponse(
            totalCost,
            costByCategory,
            costByDay,
            totalActivities,
            activitiesWithCost.size()
        );
    }

    private boolean hasAccessToTrip(Trip trip, User user) {
        if (trip.getUser().getId().equals(user.getId())) {
            return true;
        }
        if (trip.getIsPublic()) {
            return true;
        }
        return tripMemberRepository.existsByTripAndUser(trip, user);
    }
}
