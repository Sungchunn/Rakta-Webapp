"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"

const formSchema = z.object({
    subject: z
        .string()
        .min(5, "Subject must be at least 5 characters.")
        .max(50, "Subject must be at most 50 characters."),
    review: z
        .string()
        .min(20, "Review must be at least 20 characters.")
        .max(200, "Review must be at most 200 characters."),
})

export function DonationSiteReviewForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            subject: "",
            review: "",
        },
    })

    function onSubmit(data: z.infer<typeof formSchema>) {
        toast("Review Submitted", {
            description: (
                <div className="flex flex-col gap-1">
                    <p className="font-bold text-white">{data.subject}</p>
                    <p className="text-zinc-400 text-xs">{data.review}</p>
                </div>
            ),
            position: "bottom-right",
            style: {
                background: "#18181B",
                border: "1px solid #27272A",
                color: "white"
            }
        })
        form.reset();
    }

    return (
        <Card className="w-full h-full bg-zinc-900 border-zinc-800">
            <CardHeader>
                <CardTitle className="text-white">Site Review</CardTitle>
                <CardDescription className="text-zinc-400">
                    Share your donation experience to help others.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="review-form" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="subject"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="review-subject" className="text-zinc-200">
                                        Subject
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="review-subject"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="e.g. Friendly staff, clean facility"
                                        autoComplete="off"
                                        className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-primary"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="review"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="review-text" className="text-zinc-200">
                                        Review Details
                                    </FieldLabel>
                                    <InputGroup className="bg-zinc-950 border-zinc-800 focus-within:ring-primary">
                                        <InputGroupTextarea
                                            {...field}
                                            id="review-text"
                                            placeholder="Tell us about your visit..."
                                            rows={4}
                                            className="min-h-24 resize-none text-white placeholder:text-zinc-600"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        <InputGroupAddon align="block-end" className="bg-zinc-900 border-zinc-800 text-zinc-500">
                                            <InputGroupText className="tabular-nums">
                                                {field.value.length}/200
                                            </InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    <FieldDescription className="text-zinc-500">
                                        Mention wait times, staff behavior, and comfort.
                                    </FieldDescription>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <Field orientation="horizontal" className="w-full justify-between">
                    <Button type="button" variant="ghost" onClick={() => form.reset()} className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                        Reset
                    </Button>
                    <Button type="submit" form="review-form" className="bg-primary text-white hover:bg-red-600">
                        Submit Review
                    </Button>
                </Field>
            </CardFooter>
        </Card>
    )
}
