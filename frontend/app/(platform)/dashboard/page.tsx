import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import RadialSeparator from "@/components/dashboard/RadialSeparator";
import RecoveryTrendChart from "@/components/dashboard/RecoveryTrendChart";
import DailyCheckIn from "@/components/dashboard/DailyCheckIn";
import { Activity, Zap, TrendingUp, CalendarClock, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const readinessData = {
        score: 87,
        status: "OPTIMAL" as const,
        breakdown: { sleep: 80, iron: 100 },
        insight: "Your HRV is trending up! Great recovery from yesterday's donation."
    };

    const cardClass = "bg-card relative group/card dark:hover:shadow-2xl dark:hover:shadow-primary/[0.1] dark:bg-black dark:border-white/[0.2] border-white/[0.1] w-full h-full rounded-xl p-6 border";

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
                    <Button className="bg-primary hover:bg-red-600 text-white font-bold tracking-wide shadow-[0_0_25px_rgba(239,68,68,0.6)] border border-red-500/50 scale-110 origin-right transition-transform hover:scale-125">
                        <PlusCircle className="mr-2 w-4 h-4" /> RECORD DONATION
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">

                {/* Zone 1: Readiness Ring (Hero) */}
                <CardContainer className="inter-var w-full h-full" containerClassName="h-full">
                    <CardBody className={cardClass}>
                        <div className="flex justify-between items-start mb-4">
                            <CardItem translateZ="50" className="text-xl font-bold text-white">
                                System Status
                            </CardItem>
                            <CardItem translateZ="60" className="opacity-50">
                                <Activity className="w-6 h-6 text-primary" />
                            </CardItem>
                        </div>

                        <CardItem translateZ="100" className="w-full flex justify-center py-4">
                            <div className="scale-110">
                                <RadialSeparator score={readinessData.score} status={readinessData.status} />
                            </div>
                        </CardItem>

                        <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono">
                            <CardItem translateZ="40" className="bg-zinc-900/50 p-2 rounded flex justify-between w-full">
                                <span className="text-muted-foreground">SLEEP</span>
                                <span className="text-white">{readinessData.breakdown.sleep}%</span>
                            </CardItem>
                            <CardItem translateZ="40" className="bg-zinc-900/50 p-2 rounded flex justify-between w-full">
                                <span className="text-muted-foreground">IRON</span>
                                <span className="text-white font-bold text-primary">{readinessData.breakdown.iron}%</span>
                            </CardItem>
                        </div>
                    </CardBody>
                </CardContainer>

                {/* Zone 2: Recovery Trend */}
                <CardContainer className="inter-var w-full h-full md:col-span-2" containerClassName="h-full">
                    <CardBody className={cardClass}>
                        <div className="flex justify-between items-center mb-6">
                            <CardItem translateZ="50" className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-primary" />
                                <h3 className="font-bold text-lg text-white">Recovery Velocity</h3>
                            </CardItem>
                            <CardItem translateZ="30" className="text-xs text-muted-foreground font-mono">
                                LAST 30 DAYS
                            </CardItem>
                        </div>
                        <CardItem translateZ="80" className="w-full h-[250px]">
                            <RecoveryTrendChart />
                        </CardItem>
                    </CardBody>
                </CardContainer>

                {/* Zone 3: Daily Log */}
                <CardContainer className="inter-var w-full h-full" containerClassName="h-full">
                    <CardBody className={cardClass}>
                        <div className="flex items-center gap-2 mb-4">
                            <CardItem translateZ="40">
                                <Zap className="w-4 h-4 text-yellow-500" />
                            </CardItem>
                            <CardItem translateZ="50" className="font-bold text-white text-lg">
                                Daily Log
                            </CardItem>
                        </div>
                        <CardItem translateZ="60" className="w-full mt-8">
                            <DailyCheckIn />
                        </CardItem>
                    </CardBody>
                </CardContainer>

                {/* Zone 4: Countdown */}
                <CardContainer className="inter-var w-full h-full" containerClassName="h-full">
                    <CardBody className={cardClass}>
                        <div className="flex items-center gap-2 mb-2">
                            <CardItem translateZ="40">
                                <CalendarClock className="w-4 h-4 text-primary" />
                            </CardItem>
                            <CardItem translateZ="50" className="font-bold text-white text-lg">
                                Next Eligibility
                            </CardItem>
                        </div>
                        <CardItem translateZ="100" className="w-full text-right mt-10">
                            <span className="text-6xl font-black font-mono text-white tracking-tighter block shadow-primary drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">14</span>
                            <span className="block text-sm text-muted-foreground uppercase tracking-widest mt-2">Days Remaining</span>
                        </CardItem>
                    </CardBody>
                </CardContainer>

                {/* Zone 5: AI Insight */}
                <CardContainer className="inter-var w-full h-full" containerClassName="h-full">
                    <CardBody className={`${cardClass} border-primary/30 bg-primary/5`}>
                        <CardItem translateZ="50" className="mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-[10px] uppercase font-bold text-primary">AI Coach Active</span>
                        </CardItem>
                        <CardItem translateZ="80" className="text-lg text-white italic font-medium leading-relaxed">
                            "{readinessData.insight}"
                        </CardItem>
                        <CardItem translateZ="20" className="absolute bottom-6 right-6 opacity-20">
                            <Activity className="w-24 h-24" />
                        </CardItem>
                    </CardBody>
                </CardContainer>

            </div>
        </div>
    );
}
