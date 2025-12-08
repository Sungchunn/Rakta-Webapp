"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export default function DailyCheckIn() {
    const [open, setOpen] = useState(false);

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
                            <Input type="number" step="0.5" placeholder="7.5" className="bg-background border-border" />
                            <span className="text-xs text-muted-foreground">hours</span>
                        </div>
                    </div>

                    {/* Energy */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Energy Level (1-10)</label>
                        <Slider defaultValue={[5]} max={10} step={1} className="py-4" />
                    </div>

                    {/* Iron Intake */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Iron Intake Rating (1-5)</label>
                        <div className="flex justify-between">
                            {[1, 2, 3, 4, 5].map(n => (
                                <Button key={n} variant="outline" size="sm" className="h-8 w-8 hover:bg-primary hover:text-primary-foreground border-border bg-background">
                                    {n}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                <Button onClick={() => setOpen(false)} className="w-full bg-primary font-bold">
                    SUBMIT LOG
                </Button>
            </DialogContent>
        </Dialog>
    );
}
