const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const { Server } = require("socket.io")
const http = require("http")
require("express-async-errors")

dotenv.config()

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || "http://localhost:3000", credentials: true },
})

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://mongo:27017/slotswapper", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err))

// Models
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ["BUSY", "SWAPPABLE", "SWAP_PENDING"], default: "BUSY" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
})

const swapRequestSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  responder: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  requesterSlot: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  responderSlot: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  status: { type: String, enum: ["PENDING", "ACCEPTED", "REJECTED"], default: "PENDING" },
  createdAt: { type: Date, default: Date.now },
})

const User = mongoose.model("User", userSchema)
const Event = mongoose.model("Event", eventSchema)
const SwapRequest = mongoose.model("SwapRequest", swapRequestSchema)

// Auth Routes
const authRouter = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

authRouter.post("/signup", async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" })

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, password: hashedPassword })
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" })
  res.json({ token, user: { id: user._id, name, email } })
})

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: "Missing fields" })

  const user = await User.findOne({ email })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" })
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" })
  res.json({ token, user: { id: user._id, name: user.name, email } })
})

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) return res.status(401).json({ error: "No token" })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret")
    req.userId = decoded.userId
    next()
  } catch (err) {
    res.status(401).json({ error: "Invalid token" })
  }
}

// Events Routes
const eventsRouter = express.Router()

eventsRouter.get("/my", authMiddleware, async (req, res) => {
  const events = await Event.find({ owner: req.userId }).sort({ startTime: 1 })
  res.json(events)
})

eventsRouter.post("/", authMiddleware, async (req, res) => {
  const { title, startTime, endTime } = req.body
  const event = await Event.create({ title, startTime, endTime, owner: req.userId })
  io.emit("event-created", event)
  res.json(event)
})

eventsRouter.put("/:id", authMiddleware, async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true })
  io.emit("event-updated", event)
  res.json(event)
})

eventsRouter.delete("/:id", authMiddleware, async (req, res) => {
  await Event.findByIdAndDelete(req.params.id)
  io.emit("event-deleted", req.params.id)
  res.json({ ok: true })
})

// Swappable Slots
eventsRouter.get("/swappable-slots", authMiddleware, async (req, res) => {
  const slots = await Event.find({ status: "SWAPPABLE", owner: { $ne: req.userId } })
    .populate("owner", "name email")
    .sort({ startTime: 1 })
  res.json(slots)
})

// Swap Request Routes
const swapRouter = express.Router()

swapRouter.post("/swap-request", authMiddleware, async (req, res) => {
  const { mySlotId, theirSlotId } = req.body

  const mySlot = await Event.findById(mySlotId)
  const theirSlot = await Event.findById(theirSlotId)

  if (!mySlot || !theirSlot) return res.status(404).json({ error: "Slot not found" })
  if (mySlot.status !== "SWAPPABLE" || theirSlot.status !== "SWAPPABLE") {
    return res.status(400).json({ error: "Slots not swappable" })
  }

  mySlot.status = "SWAP_PENDING"
  theirSlot.status = "SWAP_PENDING"
  await mySlot.save()
  await theirSlot.save()

  const swapRequest = await SwapRequest.create({
    requester: req.userId,
    responder: theirSlot.owner,
    requesterSlot: mySlotId,
    responderSlot: theirSlotId,
  })

  io.emit("swap-request", { swapRequest, message: "New swap request" })
  res.json(swapRequest)
})

swapRouter.post("/swap-response/:requestId", authMiddleware, async (req, res) => {
  const { accept } = req.body
  const swapRequest = await SwapRequest.findById(req.params.requestId)

  if (!swapRequest) return res.status(404).json({ error: "Request not found" })

  const requesterSlot = await Event.findById(swapRequest.requesterSlot)
  const responderSlot = await Event.findById(swapRequest.responderSlot)

  if (!accept) {
    swapRequest.status = "REJECTED"
    requesterSlot.status = "SWAPPABLE"
    responderSlot.status = "SWAPPABLE"
  } else {
    // Perform swap using transaction for data consistency
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const tempOwner = requesterSlot.owner
      requesterSlot.owner = responderSlot.owner
      responderSlot.owner = tempOwner
      requesterSlot.status = "BUSY"
      responderSlot.status = "BUSY"

      await requesterSlot.save({ session })
      await responderSlot.save({ session })

      swapRequest.status = "ACCEPTED"
      await swapRequest.save({ session })

      await session.commitTransaction()
    } catch (err) {
      await session.abortTransaction()
      throw err
    } finally {
      session.endSession()
    }
  }

  if (!accept) {
    await requesterSlot.save()
    await responderSlot.save()
  }
  await swapRequest.save()

  io.emit("swap-response", { swapRequest, message: accept ? "Swap accepted" : "Swap rejected" })
  res.json(swapRequest)
})

swapRouter.get("/my-swap-requests", authMiddleware, async (req, res) => {
  const incoming = await SwapRequest.find({ responder: req.userId })
    .populate("requester", "name email")
    .populate("requesterSlot")
    .populate("responderSlot")
    .sort({ createdAt: -1 })

  const outgoing = await SwapRequest.find({ requester: req.userId })
    .populate("responder", "name email")
    .populate("requesterSlot")
    .populate("responderSlot")
    .sort({ createdAt: -1 })

  res.json({ incoming, outgoing })
})

// Routes
app.use("/api/auth", authRouter)
app.use("/api/events", eventsRouter)
app.use("/api", swapRouter)

app.get("/api/swappable-slots", authMiddleware, async (req, res) => {
  const slots = await Event.find({ status: "SWAPPABLE", owner: { $ne: req.userId } })
    .populate("owner", "name email")
    .sort({ startTime: 1 })
  res.json(slots)
})

// Socket.IO Connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id)
  socket.on("disconnect", () => console.log("User disconnected:", socket.id))
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
