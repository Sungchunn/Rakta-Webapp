"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DonationForm() {
    const [date, setDate] = useState("");
    const [type, setType] = useState("WHOLE_BLOOD");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Call API
        console.log("Logged:", { date, type });
        alert("Donation Logged!");
    };

    return (
        <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle className="text-lg font-heading text-primary">Log New Donation</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Date of Donation</label>
                        <Input
                            type="date"
                            className="bg-background border-border"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Donation Type</label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger className="bg-background border-border">
                                <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="WHOLE_BLOOD">Whole Blood</SelectItem>
                                <SelectItem value="PLATELETS">Platelets</SelectItem>
                                <SelectItem value="PLASMA">Plasma</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button type="submit" className="w-full bg-primary font-bold shadow-lg shadow-primary/20">
                        Confirm Donation
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
