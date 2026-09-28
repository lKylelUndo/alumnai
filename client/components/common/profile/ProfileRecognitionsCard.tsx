"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import ProfileCardHeader from "@/components/common/profile/ProfileCardHeader";
import { Award, ChevronLeft, ChevronRight, User } from "lucide-react";
import Image from "next/image";

import { RecognitionItem } from "@/lib/types/mentorship";

interface ProfileRecognitionsCardProps {
  recognitions?: RecognitionItem[] | null;
  pageSize?: number;
}

export default function ProfileRecognitionsCard({
  recognitions = [],
  pageSize = 3,
}: ProfileRecognitionsCardProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const items = recognitions || [];
  const totalPages = Math.ceil(items.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const currentItems = items.slice(startIndex, startIndex + pageSize);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).toUpperCase();
    } catch {
      return dateStr;
    }
  };

  return (
    <Card className="rounded-2xl p-6">
      <ProfileCardHeader
        icon={Award}
        title="Recognitions"
        description="Appreciations from students mentored or guided"
        badge={
          items.length > 0 ? (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
              {items.length}
            </span>
          ) : undefined
        }
      />

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
          <Award className="mb-2 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm">No public recognitions received yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentItems.map((rec) => {
            const student = rec.fromStudent;
            const studentProfile = student?.profile;
            const studentName = studentProfile?.fullName || "Student Mentee";
            const studentAvatar = studentProfile?.profilePicture;
            const studentField = studentProfile?.work_field || "Student";

            return (
              <div key={rec.id} className="space-y-2 border-b border-border pb-3 last:border-none last:pb-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
                      {studentAvatar ? (
                        <Image
                          src={studentAvatar}
                          alt={studentName}
                          width={32}
                          height={32}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-foreground">
                        {studentName}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {formatDate(rec.createdAt)}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[9px] font-semibold uppercase text-muted-foreground">
                    {studentField}
                  </span>
                </div>

                <div className="whitespace-pre-wrap rounded-lg bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">
                  {rec.message}
                </div>
              </div>
            );
          })}

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border pt-3 text-xs">
              <span className="text-[11px] text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Prev</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
