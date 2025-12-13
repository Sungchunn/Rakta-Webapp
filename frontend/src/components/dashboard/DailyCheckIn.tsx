"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { apiRequest } from "@/lib/api";

export default function DailyCheckIn() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sleepHours, setSleepHours] = useState<number | "">("");
    const [energyLevel, setEnergyLevel] = useState<number>(5);
    const [ironIntake, setIronIntake] = useState<number>(3);

    const handleSubmit = async () => {
        if (!sleepHours) return;

        try {
            setLoading(true);
            await apiRequest('/api/v1/health/daily/sync-from-device', 'POST', {
                date: new Date().toISOString().split('T')[0],
                sleepHours: Number(sleepHours),
                energyLevel,
                ironIntakeScore: ironIntake,
                source: "MANUAL"
            });
            setOpen(false);
            // reset form
            setSleepHours("");
            setEnergyLevel(5);
            setIronIntake(3);
        } catch (error) {
            console.error("Failed to submit daily log:", error);
            alert("Failed to submit daily log. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className="bg-primary text-primary-foreground font-bold tracking-wide shadow-[0_0_20px_rgba(255,0,51,0.4)] hover:shadow-[0_0_30px_rgba(255,0,51,0.6)] transition-all transform hover:scale-105">
                    DAILY CHECK-IN
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-heading text-primary">Log Daily Metrics</DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Sleep */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Sleep (Hours)</label>
                        <div className="flex items-center gap-4">
                            <Input
                                type="number"
                                step="0.5"
                                placeholder="7.5"
                                className="bg-background border-border"
                                value={sleepHours}
                                onChange={(e) => setSleepHours(Number(e.target.value))}
                            />
                            <span className="text-xs text-muted-foreground">hours</span>
                        </div>
                    </div>

                    {/* Energy */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Energy Level ({energyLevel}/10)</label>
                        <Slider
                            value={[energyLevel]}
                            onValueChange={(vals) => setEnergyLevel(vals[0])}
                            max={10}
                            step={1}
                            className="py-4"
                        />
                    </div>

                    {/* Iron Intake */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Iron Intake Rating (1-5)</label>
                        <div className="flex justify-between">
                            {[1, 2, 3, 4, 5].map(n => (
                                <Button
                                    key={n}
                                    variant={ironIntake === n ? "default" : "outline"}
                                    size="sm"
                                    className={`h-8 w-8 ${ironIntake === n ? "bg-primary text-primary-foreground" : "hover:bg-primary/20 bg-background border-border"}`}
                                    onClick={() => setIronIntake(n)}
                                >
                                    {n}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                <Button onClick={handleSubmit} disabled={loading} className="w-full bg-primary font-bold">
                    {loading ? "SUBMITTING..." : "SUBMIT LOG"}
                </Button>
            </DialogContent>
        </Dialog>
    );
}
