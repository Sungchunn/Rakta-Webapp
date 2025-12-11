package com.rakta.entity;

/**
 * Types of blood donations.
 * Each type has different eligibility windows and requirements.
 */
public enum DonationType {

    /**
     * Whole blood donation - standard donation type
     * Eligibility window: 56 days (8 weeks)
     */
    WHOLE_BLOOD(56),

    /**
     * Platelet (apheresis) donation
     * Eligibility window: 7 days
     */
    PLATELETS(7),

    /**
     * Plasma donation
     * Eligibility window: 28 days
     */
    PLASMA(28),

    /**
     * Double red cell donation
     * Eligibility window: 112 days (16 weeks)
     */
    DOUBLE_RED_CELL(112);

    private final int eligibilityDays;

    DonationType(int eligibilityDays) {
        this.eligibilityDays = eligibilityDays;
    }

    /**
     * Get the number of days before user is eligible to donate again.
     */
    public int getEligibilityDays() {
        return eligibilityDays;
    }
}
