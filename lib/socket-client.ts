import { io, type Socket } from "socket.io-client"

let socket: Socket | null = null

export const initSocket = (): Socket => {
  if (socket) return socket

  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000", {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  })

  socket.on("connect", () => {
    console.log("[Socket] Connected to server")
  })

  socket.on("disconnect", () => {
    console.log("[Socket] Disconnected from server")
  })

  return socket
}

export const getSocket = (): Socket | null => socket

export const closeSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
