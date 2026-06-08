"use client"
import ForgetPasswordForm from "@/components/features/auth/ForgetPasswordForm";
import { useSearchParams } from "next/navigation"

export default function ForgetPasswordPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token") ?? "";

    
    return (
        <ForgetPasswordForm token={token} />
    )
}