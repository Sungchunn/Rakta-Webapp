package com.rakta.entity;

/**
 * Status of a blood donation record.
 */
public enum DonationStatus {

    /**
     * Donation completed successfully.
     */
    COMPLETED,

    /**
     * Donation is being processed (blood being tested/stored).
     */
    PROCESSING,

    /**
     * Donation was deferred (donor didn't meet requirements).
     */
    DEFERRED
}
