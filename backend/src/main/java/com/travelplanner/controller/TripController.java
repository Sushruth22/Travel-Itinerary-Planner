package com.travelplanner.controller;

import com.travelplanner.dto.trip.TripCreateRequest;
import com.travelplanner.dto.trip.TripResponse;
import com.travelplanner.entity.User;
import com.travelplanner.service.TripService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/trips")
@Tag(name = "Trips", description = "Trip management APIs")
@SecurityRequirement(name = "bearerAuth")
public class TripController {

    @Autowired
    private TripService tripService;

    @PostMapping
    @Operation(summary = "Create a new trip", description = "Create a new trip for the authenticated user")
    public ResponseEntity<TripResponse> createTrip(
            @Valid @RequestBody TripCreateRequest request) {
        // Temporarily create trips without user authentication
        TripResponse trip = tripService.createTripWithoutAuth(request);
        return new ResponseEntity<>(trip, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get user trips", description = "Get all trips for the authenticated user")
    public ResponseEntity<Page<TripResponse>> getUserTrips(
            Pageable pageable) {
        // Temporarily return all trips without user filtering
        Page<TripResponse> trips = tripService.getAllTrips(pageable);
        return ResponseEntity.ok(trips);
    }


    @GetMapping("/test")
    @Operation(summary = "Test endpoint", description = "Simple test endpoint")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Backend is working!");
    }

    @GetMapping("/{tripId}")
    @Operation(summary = "Get trip by ID", description = "Get a specific trip by its ID")
    public ResponseEntity<TripResponse> getTripById(
            @PathVariable UUID tripId,
            @AuthenticationPrincipal User user) {
        Optional<TripResponse> trip = tripService.getTripById(tripId, user);
        return trip.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{tripId}")
    @Operation(summary = "Update trip", description = "Update an existing trip")
    public ResponseEntity<TripResponse> updateTrip(
            @PathVariable UUID tripId,
            @Valid @RequestBody TripCreateRequest request,
            @AuthenticationPrincipal User user) {
        TripResponse trip = tripService.updateTrip(tripId, request, user);
        return ResponseEntity.ok(trip);
    }

    @DeleteMapping("/{tripId}")
    @Operation(summary = "Delete trip", description = "Delete a trip (owner only)")
    public ResponseEntity<Void> deleteTrip(
            @PathVariable UUID tripId,
            @AuthenticationPrincipal User user) {
        tripService.deleteTrip(tripId, user);
        return ResponseEntity.noContent().build();
    }
}
