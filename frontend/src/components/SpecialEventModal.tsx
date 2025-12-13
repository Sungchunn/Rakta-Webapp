"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock, Info } from "lucide-react";

export default function SpecialEventModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const checkEventStatus = () => {
            const EVENT_END_DATE = new Date("2025-12-21T22:00:00+07:00"); // 10 PM Bangkok Time
            const now = new Date();
            const hasSeenPopup = localStorage.getItem("rakta_event_red_cross_fair_2025_seen");

            if (now < EVENT_END_DATE && !hasSeenPopup) {
                // Add a small delay so it doesn't pop up instantly on load
                setTimeout(() => setIsOpen(true), 1500);
            }
        };

        checkEventStatus();
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem("rakta_event_red_cross_fair_2025_seen", "true");
    };

    const handleVisitSite = () => {
        window.open("https://redcross.or.th", "_blank");
        handleClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-2 text-primary mb-2">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                            <Info className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <span className="text-sm font-bold uppercase tracking-wider text-red-500 dark:text-red-400">Special Event</span>
                    </div>
                    <DialogTitle className="text-2xl font-heading text-foreground">
                        Red Cross Fair 2025
                    </DialogTitle>
                    <DialogDescription className="text-base text-muted-foreground pt-1">
                        Join the blood donation drive at Lumphini Park.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-2">
                    {/* Event Details Grid */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-4 p-4 bg-muted/30 border border-border/50 rounded-lg">
                            <Calendar className="w-5 h-5 text-primary mt-1 shrink-0" />
                            <div>
                                <h4 className="font-semibold text-foreground">Dates</h4>
                                <p className="text-sm text-muted-foreground">Dec 11–21, 2025</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-muted/30 border border-border/50 rounded-lg">
                            <Clock className="w-5 h-5 text-primary mt-1 shrink-0" />
                            <div>
                                <h4 className="font-semibold text-foreground">Hours</h4>
                                <p className="text-sm text-muted-foreground">11:00 AM – 10:00 PM Daily</p>
                            </div>
                        </div>
                        <div className="md:col-span-2 flex items-start gap-4 p-4 bg-muted/30 border border-border/50 rounded-lg">
                            <MapPin className="w-5 h-5 text-primary mt-1 shrink-0" />
                            <div>
                                <h4 className="font-semibold text-foreground">Location</h4>
                                <p className="text-sm text-muted-foreground">Lumphini Park, Bangkok (Thai Red Cross Station)</p>
                            </div>
                        </div>
                    </div>

                    {/* Eligibility Section */}
                    <div className="space-y-3 pt-2">
                        <h3 className="font-semibold text-lg border-l-4 border-primary pl-3">Donor Eligibility</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5 marker:text-primary">
                            <li><strong className="text-foreground">Age:</strong> 17-70 years old (First-time donors must be under 60). Donors aged 17 require parental permission.</li>
                            <li><strong className="text-foreground">Health:</strong> Must be in good health and have had at least 5 hours of sleep.</li>
                            <li><strong className="text-foreground">Meals:</strong> Eat a healthy, low-fat meal at least 3 hours before donating.</li>
                            <li><strong className="text-foreground">Alcohol:</strong> Avoid alcohol for 24 hours prior to donation.</li>
                            <li><strong className="text-foreground">Smoking:</strong> Refrain from smoking for one hour before and after donating.</li>
                            <li><strong className="text-foreground">ID Required:</strong> Please bring your identification card.</li>
                        </ul>
                        <p className="text-xs text-muted-foreground italic mt-2 p-2 bg-secondary/20 rounded">
                            * Note: Individuals from the UK, France, and Ireland (1980-1996) are now welcomed back at the main National Blood Centre but may face restrictions here.
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="ghost" onClick={handleClose}>
                        Dismiss
                    </Button>
                    <Button onClick={handleVisitSite} className="bg-red-600 hover:bg-red-700 text-white">
                        Visit Red Cross Website
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
