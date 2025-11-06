"use client"

import { useEffect, useState } from "react"
import { initSocket } from "@/lib/socket-client"
import type { Socket } from "socket.io-client"

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const sock = initSocket()
    setSocket(sock)
    setIsConnected(sock.connected)

    const onConnect = () => setIsConnected(true)
    const onDisconnect = () => setIsConnected(false)

    sock.on("connect", onConnect)
    sock.on("disconnect", onDisconnect)

    return () => {
      sock.off("connect", onConnect)
      sock.off("disconnect", onDisconnect)
    }
  }, [])

  return { socket, isConnected }
}
