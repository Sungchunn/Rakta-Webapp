"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProfileForm() {
    const [isEditing, setIsEditing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement API call to update profile
        console.log("Saving changes...");
        setIsEditing(false);
    };

    return (
        <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl font-heading text-primary">Personal Profile</CardTitle>
                    <CardDescription>Manage your physiological baseline.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)} type="button">
                    {isEditing ? "Cancel" : "Edit"}
                </Button>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Age</label>
                            <Input name="age" type="number" defaultValue="28" disabled={!isEditing} className="bg-background" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Weight (kg)</label>
                            <Input name="weight" type="number" defaultValue="72" disabled={!isEditing} className="bg-background" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Blood Type</label>
                        <Select disabled={!isEditing} defaultValue="O_POSITIVE" name="bloodType">
                            <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Select Blood Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="A_POSITIVE">A+</SelectItem>
                                <SelectItem value="O_POSITIVE">O+</SelectItem>
                                <SelectItem value="B_NEGATIVE">B-</SelectItem>
                                {/* ... others */}
                            </SelectContent>
                        </Select>
                    </div>

                    {isEditing && (
                        <Button type="submit" className="w-full bg-primary font-bold">Save Changes</Button>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
