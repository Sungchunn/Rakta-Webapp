import * as React from "react"
import { cn } from "@/lib/utils"

const InputGroup = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex w-full items-stretch rounded-md border border-input bg-transparent shadow-sm focus-within:ring-1 focus-within:ring-ring", className)}
        {...props}
    />
))
InputGroup.displayName = "InputGroup"

const InputGroupAddon = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { align?: "start" | "end" | "block-end" }
>(({ className, align, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "flex items-center px-3 text-muted-foreground border-l border-input bg-muted/50",
            align === "block-end" && "border-l-0 border-t w-full justify-end",
            className
        )}
        {...props}
    />
))
InputGroupAddon.displayName = "InputGroupAddon"

const InputGroupText = React.forwardRef<
    HTMLSpanElement,
    React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
    <span
        ref={ref}
        className={cn("text-xs", className)}
        {...props}
    />
))
InputGroupText.displayName = "InputGroupText"

const InputGroupTextarea = React.forwardRef<
    HTMLTextAreaElement,
    React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
    <textarea
        ref={ref}
        className={cn(
            "flex w-full bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            className
        )}
        {...props}
    />
))
InputGroupTextarea.displayName = "InputGroupTextarea"

export { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea }
