"use client";

import DonationForm from "@/components/tracking/DonationForm";
import EligibilityCountdown from "@/components/tracking/EligibilityCountdown";
import DonationHistory from "@/components/tracking/DonationHistory";

export default function LogPage() {
    return (
        <div className="flex flex-col gap-6 max-w-md mx-auto min-h-full py-4 px-2">
            <h1 className="text-2xl font-bold font-heading text-white mb-2">My Journey</h1>

            <EligibilityCountdown daysRemaining={14} />

            <DonationForm />

            <div className="mt-4">
                <DonationHistory />
            </div>
        </div>
    );
}
