package com.travelplanner.service;

import com.travelplanner.dto.activity.ActivityCreateRequest;
import com.travelplanner.entity.*;
import com.travelplanner.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@Transactional
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private DayPlanRepository dayPlanRepository;

    @Autowired
    private TripMemberRepository tripMemberRepository;

    @Autowired
    private TagRepository tagRepository;

    public Activity createActivity(UUID dayPlanId, ActivityCreateRequest request, User user) {
        DayPlan dayPlan = dayPlanRepository.findById(dayPlanId)
            .orElseThrow(() -> new RuntimeException("Day plan not found"));

        if (!canEditTrip(dayPlan.getTrip(), user)) {
            throw new AccessDeniedException("You don't have permission to add activities to this trip");
        }

        Activity activity = new Activity();
        activity.setTitle(request.getTitle());
        activity.setDescription(request.getDescription());
        activity.setStartTime(request.getStartTime());
        activity.setEndTime(request.getEndTime());
        activity.setLocation(request.getLocation());
        activity.setCost(request.getCost());
        activity.setCategory(request.getCategory());
        activity.setBookingUrl(request.getBookingUrl());
        activity.setNotes(request.getNotes());
        activity.setDayPlan(dayPlan);

        // Handle tags
        if (request.getTagNames() != null && !request.getTagNames().isEmpty()) {
            Set<Tag> tags = new HashSet<>();
            for (String tagName : request.getTagNames()) {
                Tag tag = tagRepository.findByName(tagName)
                    .orElseGet(() -> tagRepository.save(new Tag(tagName)));
                tags.add(tag);
            }
            activity.setTags(tags);
        }

        return activityRepository.save(activity);
    }

    public List<Activity> getActivitiesByDayPlan(UUID dayPlanId, User user) {
        DayPlan dayPlan = dayPlanRepository.findById(dayPlanId)
            .orElseThrow(() -> new RuntimeException("Day plan not found"));

        if (!hasAccessToTrip(dayPlan.getTrip(), user)) {
            throw new AccessDeniedException("You don't have access to this trip");
        }

        return activityRepository.findByDayPlanOrderByStartTimeAsc(dayPlan);
    }

    public Activity updateActivity(UUID activityId, ActivityCreateRequest request, User user) {
        Activity activity = activityRepository.findById(activityId)
            .orElseThrow(() -> new RuntimeException("Activity not found"));

        if (!canEditTrip(activity.getDayPlan().getTrip(), user)) {
            throw new AccessDeniedException("You don't have permission to edit this activity");
        }

        activity.setTitle(request.getTitle());
        activity.setDescription(request.getDescription());
        activity.setStartTime(request.getStartTime());
        activity.setEndTime(request.getEndTime());
        activity.setLocation(request.getLocation());
        activity.setCost(request.getCost());
        activity.setCategory(request.getCategory());
        activity.setBookingUrl(request.getBookingUrl());
        activity.setNotes(request.getNotes());

        // Handle tags
        if (request.getTagNames() != null) {
            Set<Tag> tags = new HashSet<>();
            for (String tagName : request.getTagNames()) {
                Tag tag = tagRepository.findByName(tagName)
                    .orElseGet(() -> tagRepository.save(new Tag(tagName)));
                tags.add(tag);
            }
            activity.setTags(tags);
        }

        return activityRepository.save(activity);
    }

    public void deleteActivity(UUID activityId, User user) {
        Activity activity = activityRepository.findById(activityId)
            .orElseThrow(() -> new RuntimeException("Activity not found"));

        if (!canEditTrip(activity.getDayPlan().getTrip(), user)) {
            throw new AccessDeniedException("You don't have permission to delete this activity");
        }

        activityRepository.delete(activity);
    }

    public Activity toggleActivityCompletion(UUID activityId, User user) {
        Activity activity = activityRepository.findById(activityId)
            .orElseThrow(() -> new RuntimeException("Activity not found"));

        if (!hasAccessToTrip(activity.getDayPlan().getTrip(), user)) {
            throw new AccessDeniedException("You don't have access to this trip");
        }

        activity.setIsCompleted(!activity.getIsCompleted());
        return activityRepository.save(activity);
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

    private boolean canEditTrip(Trip trip, User user) {
        if (trip.getUser().getId().equals(user.getId())) {
            return true;
        }
        Optional<TripMember> memberOpt = tripMemberRepository.findByTripAndUser(trip, user);
        return memberOpt.isPresent() && memberOpt.get().getCanEdit();
    }
}
