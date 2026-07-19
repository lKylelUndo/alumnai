"use client"

import { useEffect } from "react"
import { io } from "socket.io-client"
import Header from "@/components/common/Header"
import LandingPage from "@/components/features/home/LandingPage"
import Footer from "@/components/common/Footer"

export default function Page() {
  useEffect(() => {
    const socket = io("http://localhost:8000")

    socket.on("connect", () => {
      console.log("Connected", socket.id)

      socket.emit("request", "Test Chat")
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <>
      <Header />
      <LandingPage />
      <Footer />
    </>
  )
}
