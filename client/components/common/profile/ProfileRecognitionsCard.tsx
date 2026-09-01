"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
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
    <Card className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-[#e0e0ff]/20 text-[#1877F2] flex items-center justify-center">
          <Award className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[#131b2e]">Recognitions</h3>
            {items.length > 0 && (
              <span className="rounded-full bg-[#dde1ff] px-2 py-0.5 text-[10px] font-bold text-[#1877F2]">
                {items.length}
              </span>
            )}
          </div>
          <p className="text-sm text-[#434657]">
            Appreciations from students mentored or guided
          </p>
        </div>
      </div>

      {/* Content */}
      {items.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-6 text-[#434657]">
          <Award className="h-10 w-10 mb-2 text-[#A4B1CC]/50" />
          <p className="text-sm italic">No public recognitions received yet.</p>
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
              <div key={rec.id} className="space-y-2 border-b border-[#E2E8F0] pb-3 last:border-none last:pb-0">
                {/* Student header row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#E2E8F0] bg-[#F1F5F9]">
                      {studentAvatar ? (
                        <Image
                          src={studentAvatar}
                          alt={studentName}
                          width={32}
                          height={32}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4 text-[#A4B1CC]" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-[#131b2e]">
                        {studentName}
                      </p>
                      <p className="text-[10px] text-[#A4B1CC]">
                        {formatDate(rec.createdAt)}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 rounded bg-[#F1F5F9] px-1.5 py-0.5 text-[9px] font-semibold text-[#434657] uppercase">
                    {studentField}
                  </span>
                </div>

                {/* Message bubble */}
                <div className="rounded-lg bg-[#F8FAFC] p-3 text-xs leading-relaxed text-[#434657] whitespace-pre-wrap">
                  {rec.message}
                </div>
              </div>
            );
          })}

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-3 text-xs">
              <span className="text-[11px] text-[#434657]">
                Page {currentPage} of {totalPages}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1 rounded-md border border-[#E2E8F0] bg-white px-2.5 py-1 text-xs font-medium text-[#434657] transition cursor-pointer hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Prev</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-1 rounded-md border border-[#E2E8F0] bg-white px-2.5 py-1 text-xs font-medium text-[#434657] transition cursor-pointer hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed"
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
