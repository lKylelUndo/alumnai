"use client"

import { useRef } from "react"
import { UserRoundIcon, CameraIcon } from "lucide-react"

interface ProfilePictureUploadProps {
  value?: string
  onChange: (base64: string) => void
}

export default function ProfilePictureUpload({
  value,
  onChange,
}: ProfilePictureUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 1024 * 1024 * 10) {
      alert("File size must be less than 10MB")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      onChange(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="mb-6 flex items-center gap-4">
      <div className="relative">
        <div
          className="flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-muted transition hover:border-primary"
          onClick={() => fileInputRef.current?.click()}
        >
          {value ? (
            <img
              src={value}
              alt="Profile preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <UserRoundIcon className="h-8 w-8 text-muted-foreground" />
          )}
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow-sm transition hover:bg-primary/90"
        >
          <CameraIcon size={12} />
        </button>
      </div>

      <div>
        <p className="text-sm font-medium">Profile Picture</p>
        <p className="text-xs text-muted-foreground">
          Click the avatar to upload a new photo
        </p>
        {value && (
          <button
            type="button"
            className="mt-1 text-xs text-destructive hover:underline"
            onClick={() => {
              onChange("")
              if (fileInputRef.current) fileInputRef.current.value = ""
            }}
          >
            Remove photo
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="sr-only"
        onChange={handleFileChange}
      />
    </div>
  )
}
