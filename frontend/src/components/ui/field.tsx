import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const Field = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { orientation?: "vertical" | "horizontal" }
>(({ className, orientation = "vertical", ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "flex flex-col gap-2",
            orientation === "horizontal" && "flex-row items-center",
            className
        )}
        {...props}
    />
))
Field.displayName = "Field"

const FieldGroup = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-4", className)} {...props} />
))
FieldGroup.displayName = "FieldGroup"

const FieldLabel = React.forwardRef<
    HTMLLabelElement,
    React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
    <label
        ref={ref}
        className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
        {...props}
    />
))
FieldLabel.displayName = "FieldLabel"

const FieldDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-xs text-muted-foreground", className)}
        {...props}
    />
))
FieldDescription.displayName = "FieldDescription"

const FieldError = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement> & { errors?: any[] }
>(({ className, errors, ...props }, ref) => {
    if (!errors || errors.length === 0) return null
    return (
        <p
            ref={ref}
            className={cn("text-xs font-medium text-destructive", className)}
            {...props}
        >
            {errors[0]?.message}
        </p>
    )
})
FieldError.displayName = "FieldError"

export { Field, FieldGroup, FieldLabel, FieldDescription, FieldError }
