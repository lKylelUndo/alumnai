"use client";

import { StudentMentorCardTypes } from "@/lib/types/mentorship";
import { mentorshipService } from "@/services/mentorship.service";
import { Row } from "@tanstack/react-table";
import { Award, CheckCircle2, User, UserCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import MentorRecognitionDialog from "./MentorRecognitionDialog";
import ConfirmEndDialog from "@/components/common/dialogs/ConfirmEndDialog";

export default function MentorCard({
  row,
  onRemoved,
}: {
  row: Row<StudentMentorCardTypes>;
  onRemoved?: (id: string) => void;
}) {
  const mentor = row.original;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [recognitionDialogOpen, setRecognitionDialogOpen] = useState(false);
  const [recognition, setRecognition] = useState(mentor.recognition ?? null);
  const [endMentorshipOpen, setEndMentorshipOpen] = useState(false);

  const handleEndMentorship = () => setEndMentorshipOpen(true);

  const handleConfirmEndMentorship = async () => {
    try {
      setLoading(true);
      const response = await mentorshipService.endMentorship({
        mentorshipRecordId: mentor.mentorshipRecordId,
      });

      if (response.status === "success") {
        onRemoved?.(mentor.mentorshipRecordId);
        toast.success("Mentorship ended");
        setEndMentorshipOpen(false);
      }
    } catch (error) {
      console.error("Failed to end mentorship", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecognitionSaved = (savedRecognition: {
    id: string;
    message: string;
    createdAt: string;
    updatedAt: string;
  }) => {
    setRecognition(savedRecognition);
    router.refresh();
  };

  const isRecognized = Boolean(recognition);

  return (
    <div className="group relative rounded-2xl border border-[#E2E6F3] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1A216D]/30 hover:shadow-lg hover:shadow-[#1A216D]/10">
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Top Header Row with Recognition Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#E2E6F3] bg-[#EEF0FB] transition-all duration-300 group-hover:border-[#1A216D]/30">
            {mentor.profilePicture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mentor.profilePicture}
                alt={mentor.fullName}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="text-base font-bold text-[#1A216D]/60">
                <User />
              </span>
            )}
          </div>

          <div className="flex-1">
            <p className="text-sm font-bold leading-tight text-[#1A216D]">
              {mentor.fullName}
            </p>
            <p className="mt-0.5 text-xs font-semibold tracking-wider text-[#4F5EBD]">
              {mentor.currentPosition || mentor.workField}
            </p>
            <p className="mt-0.5 text-[11px] font-medium tracking-wider text-gray-400 uppercase">
              {mentor.companyName || mentor.workField}
            </p>
          </div>
        </div>

        {/* Quick recognition status icon/badge */}
        <button
          type="button"
          id={`quick-recognize-mentor-${mentor.toAlumniId}`}
          onClick={() => setRecognitionDialogOpen(true)}
          title={isRecognized ? "Edit Recognition" : "Recognize Mentor"}
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all ${
            isRecognized
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              : "border border-[#1877F2]/20 bg-[#F0F4FF] text-[#1877F2] hover:bg-[#1877F2] hover:text-white"
          }`}
        >
          {isRecognized ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Recognized</span>
            </>
          ) : (
            <>
              <Award className="h-3.5 w-3.5" />
              <span>Recognize</span>
            </>
          )}
        </button>
      </div>

      {/* Action Buttons Row */}
      <div className="mt-5 flex items-center gap-2">
        <button
          id={`view-profile-mentor-${mentor.toAlumniId}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#E2E6F3] bg-white px-2.5 py-1.5 min-h-10 text-xs font-semibold text-[#1A216D] transition-all duration-200 hover:border-[#1A216D] hover:bg-[#1A216D] hover:text-white active:scale-95"
          onClick={() => router.push(`/student/profile/view/${mentor.toAlumniId}`)}
        >
          <UserCircle2 className="h-3.5 w-3.5" />
          <span>Profile</span>
        </button>

        <button
          id={`recognize-mentor-btn-${mentor.toAlumniId}`}
          onClick={() => setRecognitionDialogOpen(true)}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-full border px-2.5 py-1.5 min-h-10 text-xs font-semibold transition-all duration-200 active:scale-95 ${
            isRecognized
              ? "border-emerald-300 bg-emerald-50/70 text-emerald-800 hover:bg-emerald-600 hover:text-white hover:border-emerald-600"
              : "border-[#1877F2]/30 bg-[#F0F4FF] text-[#1877F2] hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]"
          }`}
        >
          <Award className="h-3.5 w-3.5" />
          <span>{isRecognized ? "Edit Note" : "Recognize"}</span>
        </button>

        <button
          id={`end-mentorship-${mentor.mentorshipRecordId}`}
          disabled={loading}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#793A3A]/40 bg-white px-2.5 py-1.5 min-h-10 text-xs font-semibold text-[#793A3A] transition-all duration-200 hover:border-red-400 hover:bg-red-500 hover:text-white active:scale-95 disabled:opacity-50"
          onClick={handleEndMentorship}
        >
          <XCircle className="h-3.5 w-3.5" />
          <span>End</span>
        </button>
      </div>

      {/* Recognition Dialog */}
      <MentorRecognitionDialog
        open={recognitionDialogOpen}
        onOpenChange={setRecognitionDialogOpen}
        mentor={{
          ...mentor,
          recognition,
        }}
        onRecognitionSaved={handleRecognitionSaved}
      />

      <ConfirmEndDialog
        open={endMentorshipOpen}
        onOpenChange={setEndMentorshipOpen}
        onConfirm={handleConfirmEndMentorship}
        title="End this mentorship?"
        description="This is permanent. Ending the mentorship closes it along with its chat history. You can start a new mentorship with this person later by sending a request."
        confirmLabel="End Mentorship"
        pendingLabel="Ending..."
        isPending={loading}
      />
    </div>
  );
}
