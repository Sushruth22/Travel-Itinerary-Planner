package com.travelplanner.controller;

import com.travelplanner.dto.activity.ActivityCreateRequest;
import com.travelplanner.entity.Activity;
import com.travelplanner.entity.User;
import com.travelplanner.service.ActivityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@Tag(name = "Activities", description = "Activity management APIs")
@SecurityRequirement(name = "bearerAuth")
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @PostMapping("/dayplans/{dayPlanId}/activities")
    @Operation(summary = "Create activity", description = "Create a new activity for a day plan")
    public ResponseEntity<Activity> createActivity(
            @PathVariable UUID dayPlanId,
            @Valid @RequestBody ActivityCreateRequest request,
            @AuthenticationPrincipal User user) {
        Activity activity = activityService.createActivity(dayPlanId, request, user);
        return new ResponseEntity<>(activity, HttpStatus.CREATED);
    }

    @GetMapping("/dayplans/{dayPlanId}/activities")
    @Operation(summary = "Get activities", description = "Get all activities for a day plan")
    public ResponseEntity<List<Activity>> getActivitiesByDayPlan(
            @PathVariable UUID dayPlanId,
            @AuthenticationPrincipal User user) {
        List<Activity> activities = activityService.getActivitiesByDayPlan(dayPlanId, user);
        return ResponseEntity.ok(activities);
    }

    @PutMapping("/activities/{activityId}")
    @Operation(summary = "Update activity", description = "Update an existing activity")
    public ResponseEntity<Activity> updateActivity(
            @PathVariable UUID activityId,
            @Valid @RequestBody ActivityCreateRequest request,
            @AuthenticationPrincipal User user) {
        Activity activity = activityService.updateActivity(activityId, request, user);
        return ResponseEntity.ok(activity);
    }

    @DeleteMapping("/activities/{activityId}")
    @Operation(summary = "Delete activity", description = "Delete an activity")
    public ResponseEntity<Void> deleteActivity(
            @PathVariable UUID activityId,
            @AuthenticationPrincipal User user) {
        activityService.deleteActivity(activityId, user);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/activities/{activityId}/toggle-completion")
    @Operation(summary = "Toggle activity completion", description = "Mark activity as completed or incomplete")
    public ResponseEntity<Activity> toggleActivityCompletion(
            @PathVariable UUID activityId,
            @AuthenticationPrincipal User user) {
        Activity activity = activityService.toggleActivityCompletion(activityId, user);
        return ResponseEntity.ok(activity);
    }
}
