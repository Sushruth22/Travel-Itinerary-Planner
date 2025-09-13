package com.travelplanner.service;

import com.travelplanner.dto.trip.TripCreateRequest;
import com.travelplanner.dto.trip.TripResponse;
import com.travelplanner.dto.user.UserSummaryResponse;
import com.travelplanner.entity.*;
import com.travelplanner.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@Transactional
public class TripService {

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private TripMemberRepository tripMemberRepository;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private DayPlanRepository dayPlanRepository;

    public TripResponse createTrip(TripCreateRequest request, User user) {
        Trip trip = new Trip();
        trip.setTitle(request.getTitle());
        trip.setDescription(request.getDescription());
        trip.setStartDate(request.getStartDate());
        trip.setEndDate(request.getEndDate());
        trip.setDestination(request.getDestination());
        trip.setBudget(request.getBudget());
        trip.setIsPublic(request.getIsPublic());
        trip.setCoverImageUrl(request.getCoverImageUrl());
        trip.setUser(user);

        // Handle tags
        if (request.getTagNames() != null && !request.getTagNames().isEmpty()) {
            Set<Tag> tags = new HashSet<>();
            for (String tagName : request.getTagNames()) {
                Tag tag = tagRepository.findByName(tagName)
                    .orElseGet(() -> tagRepository.save(new Tag(tagName)));
                tags.add(tag);
            }
            trip.setTags(tags);
        }

        trip = tripRepository.save(trip);

        // Create owner as trip member
        TripMember ownerMember = new TripMember(trip, user, TripMember.MemberRole.OWNER);
        tripMemberRepository.save(ownerMember);

        // Create day plans for each day of the trip
        createDayPlansForTrip(trip);

        return convertToTripResponse(trip);
    }

    public Page<TripResponse> getUserTrips(User user, Pageable pageable) {
        Page<Trip> trips = tripRepository.findByUserOrMember(user, pageable);
        return trips.map(this::convertToTripResponse);
    }

    public Optional<TripResponse> getTripById(UUID tripId, User user) {
        Optional<Trip> tripOpt = tripRepository.findById(tripId);
        if (tripOpt.isEmpty()) {
            return Optional.empty();
        }

        Trip trip = tripOpt.get();
        
        // Check if user has access to this trip
        if (!hasAccessToTrip(trip, user)) {
            throw new AccessDeniedException("You don't have access to this trip");
        }

        return Optional.of(convertToTripResponse(trip));
    }

    public TripResponse updateTrip(UUID tripId, TripCreateRequest request, User user) {
        Trip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));

        if (!canEditTrip(trip, user)) {
            throw new AccessDeniedException("You don't have permission to edit this trip");
        }

        trip.setTitle(request.getTitle());
        trip.setDescription(request.getDescription());
        trip.setStartDate(request.getStartDate());
        trip.setEndDate(request.getEndDate());
        trip.setDestination(request.getDestination());
        trip.setBudget(request.getBudget());
        trip.setIsPublic(request.getIsPublic());
        trip.setCoverImageUrl(request.getCoverImageUrl());

        // Handle tags
        if (request.getTagNames() != null) {
            Set<Tag> tags = new HashSet<>();
            for (String tagName : request.getTagNames()) {
                Tag tag = tagRepository.findByName(tagName)
                    .orElseGet(() -> tagRepository.save(new Tag(tagName)));
                tags.add(tag);
            }
            trip.setTags(tags);
        }

        trip = tripRepository.save(trip);
        return convertToTripResponse(trip);
    }

    public void deleteTrip(UUID tripId, User user) {
        Trip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));

        if (!trip.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("Only trip owner can delete the trip");
        }

        tripRepository.delete(trip);
    }

    private void createDayPlansForTrip(Trip trip) {
        LocalDate currentDate = trip.getStartDate();
        while (!currentDate.isAfter(trip.getEndDate())) {
            DayPlan dayPlan = new DayPlan(currentDate, trip);
            dayPlanRepository.save(dayPlan);
            currentDate = currentDate.plusDays(1);
        }
    }

    private boolean hasAccessToTrip(Trip trip, User user) {
        // Owner has access
        if (trip.getUser().getId().equals(user.getId())) {
            return true;
        }

        // Public trips are accessible
        if (trip.getIsPublic()) {
            return true;
        }

        // Check if user is a member
        return tripMemberRepository.existsByTripAndUser(trip, user);
    }

    private boolean canEditTrip(Trip trip, User user) {
        // Owner can edit
        if (trip.getUser().getId().equals(user.getId())) {
            return true;
        }

        // Check if user is a member with edit permissions
        Optional<TripMember> memberOpt = tripMemberRepository.findByTripAndUser(trip, user);
        return memberOpt.isPresent() && memberOpt.get().getCanEdit();
    }

    private TripResponse convertToTripResponse(Trip trip) {
        TripResponse response = new TripResponse();
        response.setId(trip.getId());
        response.setTitle(trip.getTitle());
        response.setDescription(trip.getDescription());
        response.setStartDate(trip.getStartDate());
        response.setEndDate(trip.getEndDate());
        response.setDestination(trip.getDestination());
        response.setBudget(trip.getBudget());
        response.setIsPublic(trip.getIsPublic());
        response.setCoverImageUrl(trip.getCoverImageUrl());
        response.setTags(trip.getTags());
        response.setMemberCount(trip.getMembers().size());
        response.setCreatedAt(trip.getCreatedAt());
        response.setUpdatedAt(trip.getUpdatedAt());

        // Convert owner
        User owner = trip.getUser();
        UserSummaryResponse ownerResponse = new UserSummaryResponse(
            owner.getId(),
            owner.getFirstName(),
            owner.getLastName(),
            owner.getEmail(),
            owner.getProfilePictureUrl()
        );
        response.setOwner(ownerResponse);

        return response;
    }
}
