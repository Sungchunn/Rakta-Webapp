import DonationMap from "@/components/DonationMap";

export default function MapPage() {
    return (
        <div className="flex flex-col gap-4 h-full">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold font-heading tracking-tight text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
                    Donation Map
                </h1>
                <span className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground border border-border">
                    Bangkok Region
                </span>
            </div>

            <div className="flex-1 w-full min-h-0">
                <DonationMap />
            </div>
        </div>
    );
}
