"use client"

import dynamic from "next/dynamic"

const ChatBox = dynamic(() => import("@/components/common/ChatBox"), { ssr: false })

export default ChatBox
