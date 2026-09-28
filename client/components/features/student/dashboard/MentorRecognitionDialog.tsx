"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StudentMentorCardTypes } from "@/lib/types/mentorship";
import { mentorshipService } from "@/services/mentorship.service";
import { CheckCircle2, Loader2, Sparkles, User } from "lucide-react";

interface MentorRecognitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mentor: StudentMentorCardTypes;
  onRecognitionSaved?: (updatedRecognition: {
    id: string;
    message: string;
    createdAt: string;
    updatedAt: string;
  }) => void;
}

export default function MentorRecognitionDialog({
  open,
  onOpenChange,
  mentor,
  onRecognitionSaved,
}: MentorRecognitionDialogProps) {
  const existingMessage = mentor.recognition?.message || "";
  const [message, setMessage] = useState(existingMessage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync state whenever modal opens or existing message changes
  useEffect(() => {
    if (open) {
      setMessage(mentor.recognition?.message || "");
      setError(null);
      setIsSuccess(false);
    }
  }, [open, mentor.recognition]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmed = message.trim();
    if (!trimmed) {
      setError("Please enter a short message to appreciate your mentor.");
      return;
    }

    if (trimmed.length > 1000) {
      setError("Message cannot exceed 1000 characters.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await mentorshipService.recognizeAlumni({
        toAlumniId: mentor.toAlumniId,
        message: trimmed,
      });

      if (response.status === "success") {
        setIsSuccess(true);
        if (onRecognitionSaved && response.data) {
          onRecognitionSaved(response.data);
        }
        setTimeout(() => {
          onOpenChange(false);
          setIsSuccess(false);
        }, 1200);
      } else {
        setError(response.message || "Failed to save recognition. Please try again.");
      }
    } catch (err: any) {
      console.error("Failed to submit recognition:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "An unexpected error occurred while saving your recognition.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const isEditing = Boolean(mentor.recognition);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-6 sm:rounded-2xl">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl font-bold text-[#1A216D]">
            Mentor Recognition
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            Write a short message to appreciate this mentor
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <p className="text-base font-semibold text-emerald-700">
              {isEditing ? "Recognition Updated!" : "Recognition Sent!"}
            </p>
            <p className="text-xs text-gray-500">
              Your mentor will see this recognition on their profile.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {/* Mentor Info Header Card */}
            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-[#F8FAFC] p-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#E2E6F3] bg-[#EEF0FB]">
                {mentor.profilePicture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mentor.profilePicture}
                    alt={mentor.fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-[#1A216D]/60">
                    <User className="h-6 w-6" />
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#1A216D]">
                  {mentor.fullName}
                </p>
                <p className="truncate text-xs font-semibold text-[#4F5EBD]">
                  {mentor.currentPosition || mentor.workField}
                </p>
                <p className="truncate text-[11px] font-medium tracking-wider text-gray-400 uppercase">
                  {mentor.companyName || mentor.workField}
                </p>
              </div>

              {isEditing && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
                  <Sparkles className="h-3 w-3" />
                  Editing
                </span>
              )}
            </div>

            {/* Recognition Textarea */}
            <div className="space-y-1.5">
              <Textarea
                id="mentor-recognition-message-input"
                placeholder="Write your recognition message here... e.g. Thank you for your guidance, insights, and mentorship throughout my project!"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                maxLength={1000}
                className="w-full resize-none rounded-xl border-gray-300 p-3 text-sm transition-all focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2]"
              />
              <div className="flex items-center justify-between px-1 text-[11px] text-gray-400">
                <span>{message.length} / 1000 characters</span>
                {isEditing && (
                  <span className="text-gray-400">
                    You can edit any typos anytime.
                  </span>
                )}
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 p-2.5 text-xs font-medium text-red-600">
                {error}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
                className="rounded-full px-4 text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !message.trim()}
                className="rounded-full bg-[#1877F2] px-6 text-xs font-semibold text-white hover:bg-[#1565C0] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                    Saving...
                  </>
                ) : isEditing ? (
                  "Update"
                ) : (
                  "Send"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
