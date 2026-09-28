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
    } catch (err) {
      console.error("Failed to submit recognition:", err);
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err instanceof Error ? err.message : null) ||
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
          <DialogTitle className="text-xl font-bold text-primary">
            Mentor Recognition
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Write a short message to appreciate this mentor
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center gap-3 py-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <p className="text-base font-semibold text-emerald-600">
              {isEditing ? "Recognition Updated!" : "Recognition Sent!"}
            </p>
            <p className="text-xs text-muted-foreground">
              Your mentor will see this recognition on their profile.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {/* Mentor Info Header Card */}
            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 p-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
                {mentor.profilePicture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mentor.profilePicture}
                    alt={mentor.fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-primary/60">
                    <User className="h-6 w-6" />
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-foreground">
                  {mentor.fullName}
                </p>
                <p className="truncate text-xs font-semibold text-primary">
                  {mentor.currentPosition || mentor.workField}
                </p>
                <p className="truncate text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {mentor.companyName || mentor.workField}
                </p>
              </div>

              {isEditing && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
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
                className="w-full resize-none rounded-xl p-3 text-sm"
              />
              <div className="flex flex-col gap-0.5 px-1 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <span>{message.length} / 1000 characters</span>
                {isEditing && (
                  <span>
                    You can edit any typos anytime.
                  </span>
                )}
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-destructive/10 p-2.5 text-xs font-medium text-destructive">
                {error}
              </p>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:items-center sm:justify-end sm:gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
                className="h-11 w-full rounded-full text-xs font-semibold sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !message.trim()}
                className="h-11 w-full rounded-full bg-primary text-xs font-semibold text-white hover:bg-primary/90 disabled:opacity-50 sm:w-auto"
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
