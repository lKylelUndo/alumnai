"use client";

import StudentProfileHeader from "@/components/features/student/profile/StudentProfileHeader";
import StudentProfileAbout from "@/components/features/student/profile/StudentProfileAbout";
import StudentCurrentMentors from "@/components/features/student/profile/StudentCurrentMentors";

import AlumniProfileHeader from "@/components/features/alumni/profile/AlumniProfileHeader";
import AlumniProfileAbout from "@/components/features/alumni/profile/AlumniProfileAbout";
import AlumniRecognition from "@/components/features/alumni/profile/AlumniRecognition";

import Certifications from "@/components/common/Certifications";
import { Button } from "@/components/ui/button";

type UserRole = "student" | "alumni";

interface ViewProfileProps {
    profileRole: UserRole;
    viewerRole: UserRole;
}

export default function ViewProfile({
    profileRole,
    viewerRole,
}: ViewProfileProps) {
    const isStudentProfile = profileRole === "student";
    const isAlumniProfile = profileRole === "alumni";

    const isStudentViewer = viewerRole === "student";
    const isAlumniViewer = viewerRole === "alumni";

    return (
        <div className="mx-auto mt-4 w-full max-w-[1200px] p-4 md:p-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                {/* LEFT COLUMN */}
                <div className="space-y-6 lg:col-span-2">

                    {/* Student Profile */}
                    {profileRole === "student" && (
                        <>
                            <StudentProfileHeader mode="view" />
                            <StudentProfileAbout />
                        </>
                    )}

                    {/* Alumni Profile */}
                    {profileRole === "alumni" && (
                        <>
                            <AlumniProfileHeader mode="view" />
                            <AlumniProfileAbout />
                        </>
                    )}

                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-6 lg:col-span-1">

                    {/* Student-specific sections */}
                    {isStudentProfile && (
                        <>
                            <StudentCurrentMentors />
                            <Certifications />
                        </>
                    )}

                    {/* Alumni-specific sections */}
                    {isAlumniProfile && (
                        <>
                            <AlumniRecognition />
                            <Certifications />
                        </>
                    )}

                    {/* Student viewing Alumni */}
                    {isStudentViewer && isAlumniProfile && (
                        <Button className="w-full">
                            Apply for Mentorship
                        </Button>
                    )}

                    {/* Alumni viewing Student */}
                    {isAlumniViewer && isStudentProfile && (
                        <Button className="w-full">
                            Send Collaboration Request
                        </Button>
                    )}

                </div>
            </div>
        </div>
    );
}