"use client"
import { QuizSkeleton } from "@/components/Skeleton";
import useIsMobile from "@/utils/useIsMobile";

export default function Loading () {
    const isMobile = useIsMobile();
    return <QuizSkeleton isMobile={isMobile} />
}