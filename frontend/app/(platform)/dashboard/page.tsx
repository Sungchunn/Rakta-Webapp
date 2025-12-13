"use client";

import dynamic from 'next/dynamic';
import { useDashboardData } from "@/hooks/useDashboardData";
import { Activity, Zap, CalendarClock, PlusCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Dynamic imports with SSR disabled for heavy animation/chart components
const CardContainer = dynamic(() => import("@/components/ui/3d-card").then(mod => mod.CardContainer), { ssr: false });
const CardBody = dynamic(() => import("@/components/ui/3d-card").then(mod => mod.CardBody), { ssr: false });
const CardItem = dynamic(() => import("@/components/ui/3d-card").then(mod => mod.CardItem), { ssr: false });

const RadialSeparator = dynamic(() => import("@/components/dashboard/RadialSeparator"), { ssr: false });
const RecoveryTrendChart = dynamic(() => import("@/components/dashboard/RecoveryTrendChart"), { ssr: false });
const DailyCheckIn = dynamic(() => import("@/components/dashboard/DailyCheckIn"), { ssr: false });
const DonationStatsCard = dynamic(() => import("@/components/dashboard/DonationStatsCard"), { ssr: false });
const HealthMetricsCard = dynamic(() => import("@/components/dashboard/HealthMetricsCard"), { ssr: false });
const DonationCalendarCard = dynamic(() => import("@/components/dashboard/DonationCalendarCard"), { ssr: false });
const AchievementsCard = dynamic(() => import("@/components/dashboard/AchievementsCard"), { ssr: false });
const CommunityStatsCard = dynamic(() => import("@/components/dashboard/CommunityStatsCard"), { ssr: false });
const HelpTooltip = dynamic(() => import("@/components/dashboard/HelpTooltip"), { ssr: false });
const InsightCard = dynamic(() => import("@/components/dashboard/InsightCard"), { ssr: false });

export default function DashboardPage() {
    const { data: stats, loading, error } = useDashboardData();

    const cardClass = "bg-card relative group/card dark:hover:shadow-2xl dark:hover:shadow-primary/[0.1] dark:bg-black dark:border-white/[0.2] border-white/[0.1] w-full h-full rounded-xl p-6 border";

    // Loading state
    if (loading) {
        return (
            <div className="p-6 h-full flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    // Error state - show basic dashboard with mock data
    if (error || !stats) {
        console.warn("Dashboard API error, using fallback data:", error);
    }

    // Use real data or fallback to defaults
    const dashboardData = stats || {
        totalDonations: 0,
        totalVolumeMl: 0,
        livesSaved: 0,
        donationsThisYear: 0,
        isEligible: true,
        daysUntilEligible: 0,
        nextEligibleDate: null,
        lastDonationType: null,
        latestHemoglobin: null,
        latestBloodPressure: null,
        latestPulseRate: null,
        latestWeight: null,
        healthHistory: [],
        dailyTrends: [],
        monthlyDonations: {},
        currentStreak: 0,
        longestStreak: 0,
        followersCount: 0,
        followingCount: 0,
        totalBadges: 0,
        recentBadges: [],
    };

    // Calculate readiness score (simplified - can be enhanced with real API data)
    const readinessScore = dashboardData.latestHemoglobin
        ? Math.min(100, Math.round((dashboardData.latestHemoglobin / 15) * 100))
        : 87;
    const readinessStatus = readinessScore >= 85 ? "OPTIMAL"
        : readinessScore >= 70 ? "GOOD"
            : readinessScore >= 50 ? "FAIR"
                : "LOW";

    return (
        <div className="p-6 h-full flex flex-col overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-end mb-8 relative z-10">
                <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/5">
                    <h1 className="text-4xl font-black font-heading tracking-tight text-white mb-1 shadow-black drop-shadow-lg">
                        COMMAND CENTER
                    </h1>
                    <p className="text-zinc-200 font-bold font-mono uppercase tracking-widest text-sm drop-shadow-md">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/donations/new">
                        <Button className="bg-primary hover:bg-red-600 text-white font-bold tracking-wide shadow-[0_0_25px_rgba(239,68,68,0.6)] border border-red-500/50 scale-110 origin-right transition-transform hover:scale-125">
                            <PlusCircle className="mr-2 w-4 h-4" /> RECORD DONATION
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">

                {/* Zone 1: Readiness Ring (Hero) */}
                <CardContainer className="inter-var w-full h-full" containerClassName="h-full">
                    <CardBody className={cardClass}>
                        <div className="flex justify-between items-start mb-4">
                            <CardItem translateZ="50" className="text-xl font-bold text-white flex items-center gap-2">
                                System Status
                                <HelpTooltip content="Your donation readiness score based on health metrics, recovery time, and eligibility status" />
                            </CardItem>
                            <CardItem translateZ="60" className="opacity-50">
                                <Activity className="w-6 h-6 text-primary" />
                            </CardItem>
                        </div>

                        <CardItem translateZ="100" className="w-full flex justify-center py-4">
                            <div className="scale-110">
                                <RadialSeparator score={readinessScore} status={readinessStatus as "OPTIMAL" | "GOOD" | "FAIR" | "LOW"} />
                            </div>
                        </CardItem>

                        <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono">
                            <CardItem translateZ="40" className="bg-zinc-900/50 p-2 rounded flex justify-between w-full">
                                <span className="text-muted-foreground">STREAK</span>
                                <span className="text-white">{dashboardData.currentStreak} mo</span>
                            </CardItem>
                            <CardItem translateZ="40" className="bg-zinc-900/50 p-2 rounded flex justify-between w-full">
                                <span className="text-muted-foreground">DONATIONS</span>
                                <span className="text-white font-bold text-primary">{dashboardData.totalDonations}</span>
                            </CardItem>
                        </div>
                    </CardBody>
                </CardContainer>

                {/* Zone 2: Donation Stats (2-column wide) */}
                <CardContainer className="inter-var w-full h-full md:col-span-2" containerClassName="h-full">
                    <CardBody className={cardClass}>
                        <CardItem translateZ="50" className="w-full">
                            <DonationStatsCard
                                totalDonations={dashboardData.totalDonations}
                                totalVolumeMl={dashboardData.totalVolumeMl}
                                livesSaved={dashboardData.livesSaved}
                                donationsThisYear={dashboardData.donationsThisYear}
                            />
                        </CardItem>
                    </CardBody>
                </CardContainer>

                {/* Zone 3: Eligibility Countdown */}
                <CardContainer className="inter-var w-full h-full" containerClassName="h-full">
                    <CardBody className={cardClass}>
                        <div className="flex items-center gap-2 mb-2">
                            <CardItem translateZ="40">
                                <CalendarClock className="w-4 h-4 text-primary" />
                            </CardItem>
                            <CardItem translateZ="50" className="font-bold text-white text-lg">
                                Next Eligibility
                            </CardItem>
                            <HelpTooltip content={`Based on your last donation type. Whole blood: 56 days, Plasma: 28 days, Platelets: 7 days`} />
                        </div>
                        <CardItem translateZ="100" className="w-full text-right mt-10">
                            {dashboardData.isEligible ? (
                                <>
                                    <span className="text-5xl font-black font-mono text-emerald-400 tracking-tighter block drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
                                        READY
                                    </span>
                                    <span className="block text-sm text-muted-foreground uppercase tracking-widest mt-2">
                                        You can donate now!
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="text-6xl font-black font-mono text-white tracking-tighter block shadow-primary drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                                        {dashboardData.daysUntilEligible}
                                    </span>
                                    <span className="block text-sm text-muted-foreground uppercase tracking-widest mt-2">
                                        Days Remaining
                                    </span>
                                </>
                            )}
                        </CardItem>
                        {dashboardData.lastDonationType && (
                            <CardItem translateZ="20" className="absolute bottom-6 left-6 text-xs text-muted-foreground font-mono">
                                Last: {dashboardData.lastDonationType}
                            </CardItem>
                        )}
                    </CardBody>
                </CardContainer>

                {/* Zone 4: Health Metrics (2-column wide) */}
                <CardContainer className="inter-var w-full h-full md:col-span-2" containerClassName="h-full">
                    <CardBody className={cardClass}>
                        <CardItem translateZ="50" className="w-full">
                            <HealthMetricsCard
                                latestHemoglobin={dashboardData.latestHemoglobin}
                                latestBloodPressure={dashboardData.latestBloodPressure}
                                latestPulseRate={dashboardData.latestPulseRate}
                                healthHistory={dashboardData.healthHistory}
                            />
                        </CardItem>
                    </CardBody>
                </CardContainer>

                {/* Zone 5: Donation Calendar (Full width) */}
                <CardContainer className="inter-var w-full h-full md:col-span-3" containerClassName="h-full">
                    <CardBody className={cardClass}>
                        <CardItem translateZ="50" className="w-full">
                            <DonationCalendarCard
                                monthlyDonations={dashboardData.monthlyDonations}
                                currentStreak={dashboardData.currentStreak}
                                longestStreak={dashboardData.longestStreak}
                            />
                        </CardItem>
                    </CardBody>
                </CardContainer>

                {/* Zone 6: Daily Recovery & Log */}
                <CardContainer className="inter-var w-full h-full" containerClassName="h-full">
                    <CardBody className={cardClass}>
                        <div className="flex items-center gap-2 mb-2">
                            <CardItem translateZ="40">
                                <Zap className="w-4 h-4 text-yellow-500" />
                            </CardItem>
                            <CardItem translateZ="50" className="font-bold text-white text-lg">
                                Daily Recovery
                            </CardItem>
                            <HelpTooltip content="Track your daily recovery score trend. Higher score means better readiness to donate." />
                        </div>

                        {/* Trend Chart */}
                        <div className="h-28 w-full mb-4">
                            <CardItem translateZ="60" className="w-full h-full">
                                <RecoveryTrendChart data={dashboardData.dailyTrends?.map(d => ({ date: new Date(d.date).toLocaleDateString('en-US', { day: 'numeric' }), score: d.readinessScore || 0 })) || []} />
                            </CardItem>
                        </div>

                        <CardItem translateZ="80" className="w-full">
                            <DailyCheckIn />
                        </CardItem>
                    </CardBody>
                </CardContainer>

                {/* Zone 7: Achievements */}
                <CardContainer className="inter-var w-full h-full" containerClassName="h-full">
                    <CardBody className={cardClass}>
                        <CardItem translateZ="50" className="w-full h-full">
                            <AchievementsCard
                                totalBadges={dashboardData.totalBadges}
                                recentBadges={dashboardData.recentBadges}
                            />
                        </CardItem>
                    </CardBody>
                </CardContainer>

                {/* Zone 8: Community Stats */}
                <CardContainer className="inter-var w-full h-full" containerClassName="h-full">
                    <CardBody className={cardClass}>
                        <CardItem translateZ="50" className="w-full h-full">
                            <CommunityStatsCard
                                followersCount={dashboardData.followersCount}
                                followingCount={dashboardData.followingCount}
                            />
                        </CardItem>
                    </CardBody>
                </CardContainer>

                {/* Zone 9: Daily AI Expert Insight */}
                <div className="md:col-span-3 h-full min-h-[200px]">
                    <InsightCard />
                </div>

            </div>
        </div>
    );
}
