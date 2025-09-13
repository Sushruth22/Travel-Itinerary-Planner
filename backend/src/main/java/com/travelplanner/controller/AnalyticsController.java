package com.travelplanner.controller;

import com.travelplanner.dto.analytics.CostBreakdownResponse;
import com.travelplanner.entity.User;
import com.travelplanner.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/analytics")
@Tag(name = "Analytics", description = "Analytics and reporting APIs")
@SecurityRequirement(name = "bearerAuth")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/trips/{tripId}/cost-breakdown")
    @Operation(summary = "Get trip cost breakdown", description = "Get detailed cost analysis for a trip")
    public ResponseEntity<CostBreakdownResponse> getTripCostBreakdown(
            @PathVariable UUID tripId,
            @AuthenticationPrincipal User user) {
        CostBreakdownResponse breakdown = analyticsService.getTripCostBreakdown(tripId, user);
        return ResponseEntity.ok(breakdown);
    }
}
