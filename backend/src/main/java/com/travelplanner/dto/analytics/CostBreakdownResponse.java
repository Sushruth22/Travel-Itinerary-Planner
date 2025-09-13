package com.travelplanner.dto.analytics;

import com.travelplanner.entity.Activity;

import java.math.BigDecimal;
import java.util.Map;

public class CostBreakdownResponse {
    private BigDecimal totalCost;
    private Map<Activity.ActivityCategory, BigDecimal> costByCategory;
    private Map<String, BigDecimal> costByDay;
    private Integer totalActivities;
    private Integer activitiesWithCost;

    public CostBreakdownResponse() {}

    public CostBreakdownResponse(BigDecimal totalCost, Map<Activity.ActivityCategory, BigDecimal> costByCategory, 
                               Map<String, BigDecimal> costByDay, Integer totalActivities, Integer activitiesWithCost) {
        this.totalCost = totalCost;
        this.costByCategory = costByCategory;
        this.costByDay = costByDay;
        this.totalActivities = totalActivities;
        this.activitiesWithCost = activitiesWithCost;
    }

    // Getters and Setters
    public BigDecimal getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(BigDecimal totalCost) {
        this.totalCost = totalCost;
    }

    public Map<Activity.ActivityCategory, BigDecimal> getCostByCategory() {
        return costByCategory;
    }

    public void setCostByCategory(Map<Activity.ActivityCategory, BigDecimal> costByCategory) {
        this.costByCategory = costByCategory;
    }

    public Map<String, BigDecimal> getCostByDay() {
        return costByDay;
    }

    public void setCostByDay(Map<String, BigDecimal> costByDay) {
        this.costByDay = costByDay;
    }

    public Integer getTotalActivities() {
        return totalActivities;
    }

    public void setTotalActivities(Integer totalActivities) {
        this.totalActivities = totalActivities;
    }

    public Integer getActivitiesWithCost() {
        return activitiesWithCost;
    }

    public void setActivitiesWithCost(Integer activitiesWithCost) {
        this.activitiesWithCost = activitiesWithCost;
    }
}
