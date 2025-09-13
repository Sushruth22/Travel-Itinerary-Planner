package com.travelplanner.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "trip_members")
public class TripMember extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private MemberRole role = MemberRole.MEMBER;

    @Column(name = "can_edit", nullable = false)
    private Boolean canEdit = false;

    @Column(name = "can_invite", nullable = false)
    private Boolean canInvite = false;

    public enum MemberRole {
        OWNER, ADMIN, MEMBER
    }

    // Constructors
    public TripMember() {}

    public TripMember(Trip trip, User user, MemberRole role) {
        this.trip = trip;
        this.user = user;
        this.role = role;
        this.canEdit = role == MemberRole.OWNER || role == MemberRole.ADMIN;
        this.canInvite = role == MemberRole.OWNER || role == MemberRole.ADMIN;
    }

    // Getters and Setters
    public Trip getTrip() {
        return trip;
    }

    public void setTrip(Trip trip) {
        this.trip = trip;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public MemberRole getRole() {
        return role;
    }

    public void setRole(MemberRole role) {
        this.role = role;
    }

    public Boolean getCanEdit() {
        return canEdit;
    }

    public void setCanEdit(Boolean canEdit) {
        this.canEdit = canEdit;
    }

    public Boolean getCanInvite() {
        return canInvite;
    }

    public void setCanInvite(Boolean canInvite) {
        this.canInvite = canInvite;
    }
}
