"use client"

import { useReportWebVitals } from "next/web-vitals"

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log to console in development for debugging
    if (process.env.NODE_ENV === "development") {
      console.log(`[Web Vitals] ${metric.name}:`, metric.value)
    }

    // In production, send to analytics endpoint
    // Example: send to Google Analytics, Vercel Analytics, or custom endpoint
    if (process.env.NODE_ENV === "production") {
      const body = JSON.stringify({
        name: metric.name,
        value: metric.value,
        id: metric.id,
        label: metric.label,
        startTime: metric.startTime,
      })

      // Use sendBeacon for non-blocking analytics delivery
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/web-vitals", body)
      } else {
        fetch("/api/web-vitals", {
          body,
          method: "POST",
          keepalive: true,
        }).catch(() => {})
      }
    }
  })

  return null
}
