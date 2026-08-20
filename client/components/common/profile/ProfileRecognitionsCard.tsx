"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Award, ChevronLeft, ChevronRight, User } from "lucide-react";
import Image from "next/image";

export interface RecognitionItem {
  id: string;
  fromStudentId?: string;
  toAlumniId?: string;
  message: string;
  createdAt: string;
  updatedAt?: string;
  fromStudent?: {
    id: string;
    profile?: {
      fullName?: string | null;
      profilePicture?: string | null;
      work_field?: string | null;
    } | null;
  } | null;
}

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
    <Card className="rounded-xl border border-[#A4B1CC] bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F0F4FF] text-[#1877F2]">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[#1A216D]">Recognitions</h3>
              {items.length > 0 && (
                <span className="rounded-full bg-[#F0F4FF] px-2 py-0.5 text-[10px] font-bold text-[#1877F2]">
                  {items.length}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-gray-500">
              Appreciations from students mentored or guided
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {items.length === 0 ? (
        <div className="rounded-lg bg-[#F8FAFC] p-5 text-center text-xs text-gray-500">
          No public recognitions received yet.
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
              <div key={rec.id} className="space-y-2 border-b border-gray-100 pb-3 last:border-none last:pb-0">
                {/* Student header row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-[#EEF0FB]">
                      {studentAvatar ? (
                        <Image
                          src={studentAvatar}
                          alt={studentName}
                          width={32}
                          height={32}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4 text-gray-400" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-[#1A216D]">
                        {studentName}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {formatDate(rec.createdAt)}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[9px] font-semibold text-gray-600 uppercase">
                    {studentField}
                  </span>
                </div>

                {/* Message bubble */}
                <div className="rounded-lg bg-[#F8FAFC] p-3 text-xs leading-relaxed text-gray-700 whitespace-pre-wrap">
                  {rec.message}
                </div>
              </div>
            );
          })}

          {/* Normal Simple Pagination (No tanstack) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
              <span className="text-[11px] text-gray-500">
                Page {currentPage} of {totalPages}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Prev</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
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
