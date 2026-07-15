"use client"

import { useRef } from "react"
import { UserRoundIcon, CameraIcon } from "lucide-react"

interface ProfilePictureUploadProps {
  value?: string
  onChange: (base64: string) => void
}

export default function ProfilePictureUpload({ value,onChange }: ProfilePictureUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      alert("Image must be under 5MB")
      return
    }

    // Instance ni siya sa filereader na browser api
    const reader = new FileReader()

    // Purpose aning reander.onload is para ma load ang file sa reader and ma convert sa base64
    // something like this "data:image/png;base64,iVBORw0K..."
    reader.onload = () => {
      onChange(reader.result as string)
    }

    // Purpose aning reander.readAsDataURL is para ma read ang file as data url
    reader.readAsDataURL(file)
  }

  return (
    <div className="mb-6 flex items-center gap-4">
      <div className="relative">
        <div
          className="flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-muted transition hover:border-primary"
          onClick={() => fileInputRef.current?.click()}
          title="Upload profile picture"
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
        {/* Camera button to upload image */}
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
          Click the avatar to upload a new photo (PNG, JPG)
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
