package com.travelplanner.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "invitations")
public class Invitation extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inviter_id", nullable = false)
    private User inviter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invitee_id")
    private User invitee; // null if inviting by email

    @Email
    @Column(name = "invitee_email")
    private String inviteeEmail; // for inviting non-registered users

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private InvitationStatus status = InvitationStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private TripMember.MemberRole role = TripMember.MemberRole.MEMBER;

    @Column(name = "message", columnDefinition = "TEXT")
    private String message;

    @Column(name = "token", unique = true)
    private String token; // for email-based invitations

    public enum InvitationStatus {
        PENDING, ACCEPTED, DECLINED, EXPIRED
    }

    // Constructors
    public Invitation() {}

    public Invitation(Trip trip, User inviter, User invitee, TripMember.MemberRole role) {
        this.trip = trip;
        this.inviter = inviter;
        this.invitee = invitee;
        this.role = role;
    }

    public Invitation(Trip trip, User inviter, String inviteeEmail, TripMember.MemberRole role, String token) {
        this.trip = trip;
        this.inviter = inviter;
        this.inviteeEmail = inviteeEmail;
        this.role = role;
        this.token = token;
    }

    // Getters and Setters
    public Trip getTrip() {
        return trip;
    }

    public void setTrip(Trip trip) {
        this.trip = trip;
    }

    public User getInviter() {
        return inviter;
    }

    public void setInviter(User inviter) {
        this.inviter = inviter;
    }

    public User getInvitee() {
        return invitee;
    }

    public void setInvitee(User invitee) {
        this.invitee = invitee;
    }

    public String getInviteeEmail() {
        return inviteeEmail;
    }

    public void setInviteeEmail(String inviteeEmail) {
        this.inviteeEmail = inviteeEmail;
    }

    public InvitationStatus getStatus() {
        return status;
    }

    public void setStatus(InvitationStatus status) {
        this.status = status;
    }

    public TripMember.MemberRole getRole() {
        return role;
    }

    public void setRole(TripMember.MemberRole role) {
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
