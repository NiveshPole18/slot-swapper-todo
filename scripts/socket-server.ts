import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

app.use(cors())
app.use(express.json())

// Store connected users
const connectedUsers = new Set<string>()

io.on("connection", (socket) => {
  console.log(`[Socket] User connected: ${socket.id}`)
  connectedUsers.add(socket.id)

  // Handle swap initiated event
  socket.on("swap_initiated", (data) => {
    console.log(`[Socket] Swap initiated:`, data)
    // Broadcast to all connected clients
    io.emit("swap_update", {
      ...data,
      status: "pending",
      timestamp: new Date(),
    })
  })

  // Handle price subscription
  socket.on("subscribe_prices", () => {
    console.log(`[Socket] User subscribed to prices: ${socket.id}`)
  })

  socket.on("disconnect", () => {
    console.log(`[Socket] User disconnected: ${socket.id}`)
    connectedUsers.delete(socket.id)
  })

  socket.on("error", (error) => {
    console.error(`[Socket] Error:`, error)
  })
})

// Broadcast price updates every 5 seconds (simulated)
setInterval(() => {
  const tokens = ["ETH", "USDC", "DAI", "USDT", "WBTC"]
  const priceUpdate = tokens.map((token) => ({
    token,
    price: Math.random() * 50000,
    change24h: (Math.random() - 0.5) * 10,
  }))

  io.emit("price_update", priceUpdate[0])
}, 5000)

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`[Socket.IO Server] Listening on port ${PORT}`)
})
