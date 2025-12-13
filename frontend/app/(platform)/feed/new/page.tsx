"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/donations/new");
    }, [router]);

    return null;
}
