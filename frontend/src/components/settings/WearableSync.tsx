"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Watch, Smartphone } from "lucide-react";

export default function WearableSync() {
    return (
        <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle className="text-xl font-heading text-primary">Connected Devices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-secondary/20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-black rounded-full border border-gray-700">
                            <Watch size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm">Apple Health</p>
                            <p className="text-xs text-green-500">Syncing Active</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs h-8 border-green-500/50 text-green-500 hover:bg-green-500/10 hover:text-green-400">
                        Connected
                    </Button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-secondary/10 opacity-70">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-900/50 rounded-full border border-blue-800">
                            <Activity size={20} className="text-blue-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm">Garmin Connect</p>
                            <p className="text-xs text-muted-foreground">Not Connected</p>
                        </div>
                    </div>
                    <Button variant="secondary" size="sm" className="text-xs h-8">
                        Connect
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
