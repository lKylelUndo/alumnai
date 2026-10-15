"use client"

import { useState, useRef } from "react"
import { GraduationCap, UploadCloud, FileText, Trash2Icon, Loader2 } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { alumniService } from "@/services/alumni.service"

interface RequestAlumniUpgradeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function RequestAlumniUpgradeDialog({ open, onOpenChange }: RequestAlumniUpgradeDialogProps) {
  const [fileBase64, setFileBase64] = useState<string>("")
  const [fileName, setFileName] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 1024 * 1024 * 5) {
      setError("File size must be less than 5MB")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setFileBase64(reader.result as string)
      setFileName(file.name)
      setError(null)
    }
    reader.readAsDataURL(file)
  }

  const clearFile = () => {
    setFileBase64("")
    setFileName("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = async () => {
    if (!fileBase64) {
      setError("Please upload a document (e.g. diploma, certificate)")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await alumniService.requestAlumniUpgrade(fileBase64)
      setSuccess(true)
      setTimeout(() => {
        handleClose()
      }, 2000)
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to submit request"
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFileBase64("")
    setFileName("")
    setError(null)
    setSuccess(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg gap-0 p-0"
        showCloseButton={true}
      >
        <DialogHeader className="border-b px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-bold text-primary">Uploaded Documents</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Upload a document (e.g. diploma)
          </DialogDescription>
        </DialogHeader>

        <div className="min-w-0 overflow-hidden px-6 py-5">
          {success ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                <GraduationCap className="h-7 w-7" />
              </div>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                Request submitted successfully!
              </p>
              <p className="text-xs text-muted-foreground">
                An admin will review your request shortly.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-4">
              {fileName ? (
                <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{fileName}</p>
                    <p className="text-xs text-muted-foreground">Ready to upload</p>
                  </div>
                  <button
                    type="button"
                    onClick={clearFile}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center gap-3 py-6 transition hover:text-primary">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-dashed border-border bg-card">
                    <UploadCloud className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Add File</p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, PDF up to 5MB
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
          )}

          {error && (
            <p className="mt-3 text-xs font-medium text-destructive">{error}</p>
          )}
        </div>

        {!success && (
          <div className="flex items-center gap-3 border-t px-6 py-4">
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="h-11 flex-1"
              onClick={handleSubmit}
              disabled={isSubmitting || !fileBase64}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
