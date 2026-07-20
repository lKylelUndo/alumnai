"use client"

import { FileBadge, Download } from "lucide-react"
import { Card } from "../ui/card"
import { useAuthContext } from "@/context/AuthContext"

const Certifications = () => {
  const { user } = useAuthContext()
  const certs = user?.profile?.certifications || []

  return (
    <Card className="rounded-xl border border-[#A4B1CC] bg-white p-6 shadow-sm">
      <div className="mb-2 flex items-start gap-3">
        <div className="rounded-full bg-[#F0F4FF] p-2 text-[#1A216D]">
          <FileBadge className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#1A216D]">Certifications</h2>
          <p className="mt-0 text-xs text-gray-500">
            Certifications from verified organizations
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {certs.length > 0 ? (
          certs.map((cert) => (
            <div
              key={cert.id}
              className="flex items-center justify-between rounded-lg bg-[#F5F5F5] p-4"
            >
              <div>
                <p className="text-sm font-bold text-[#1A216D]">{cert.name}</p>
                <p className="mt-1 text-xs text-gray-600">{cert.issuer}</p>
              </div>
              {cert.fileUrl && (
                <a
                  href={cert.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition"
                  title="View/Download Certificate"
                >
                  <Download className="h-4 w-4" />
                </a>
              )}
            </div>
          ))
        ) : (
          <p className="text-center py-4 text-xs text-muted-foreground">
            No certifications added yet.
          </p>
        )}
      </div>
    </Card>
  )
}

export default Certifications
