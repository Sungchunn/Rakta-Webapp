"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Watch, Link2 } from "lucide-react";

function DeviceRow({
    icon,
    name,
    subtitle,
    status,
    statusTone = "muted",
    actionLabel,
    actionVariant = "secondary",
    disabled = false,
}: {
    icon: React.ReactNode;
    name: string;
    subtitle: string;
    status: string;
    statusTone?: "success" | "muted";
    actionLabel: string;
    actionVariant?: "outline" | "secondary" | "default";
    disabled?: boolean;
}) {
    return (
        <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-full border border-white/10 bg-black/40 flex items-center justify-center flex-shrink-0">
                    {icon}
                </div>

                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="font-medium text-sm text-white truncate">{name}</p>
                        <span
                            className={[
                                "text-[11px] px-2 py-0.5 rounded-full border",
                                statusTone === "success"
                                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                                    : "border-white/10 bg-white/[0.03] text-muted-foreground",
                            ].join(" ")}
                        >
                            {status}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{subtitle}</p>
                </div>
            </div>

            <Button
                variant={actionVariant}
                size="sm"
                disabled={disabled}
                className="h-8 text-xs px-3"
            >
                {actionLabel}
            </Button>
        </div>
    );
}

export default function WearableSync() {
    return (
        <Card className="bg-card/60 border-white/5">
            <CardContent className="p-5 space-y-4">
                {/* Section header (lighter, smaller) */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-white">Connected devices</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Sync activity to improve readiness insights.
                        </p>
                    </div>

                    <div className="h-9 w-9 rounded-lg border border-white/10 bg-white/[0.03] flex items-center justify-center">
                        <Link2 size={16} className="text-muted-foreground" />
                    </div>
                </div>

                <div className="space-y-3">
                    <DeviceRow
                        icon={<Watch size={18} className="text-white/90" />}
                        name="Apple Health"
                        subtitle="Syncing active"
                        status="Connected"
                        statusTone="success"
                        actionLabel="Manage"
                        actionVariant="outline"
                    />

                    <DeviceRow
                        icon={<Activity size={18} className="text-sky-300" />}
                        name="Garmin Connect"
                        subtitle="Not connected"
                        status="Not connected"
                        statusTone="muted"
                        actionLabel="Connect"
                        actionVariant="secondary"
                    />
                </div>

                {/* Optional: subtle footnote */}
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                    You can disconnect anytime. We only read permissioned health metrics.
                </p>
            </CardContent>
        </Card>
    );
}