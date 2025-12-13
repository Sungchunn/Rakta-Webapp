"use client";

import { HelpCircle } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider
} from "@/components/ui/tooltip";

interface HelpTooltipProps {
    content: string;
    className?: string;
}

export default function HelpTooltip({ content, className }: HelpTooltipProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        className={`inline-flex items-center justify-center text-muted-foreground hover:text-primary transition-colors ${className}`}
                        type="button"
                    >
                        <HelpCircle className="w-4 h-4" />
                    </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-left">
                    <p>{content}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
