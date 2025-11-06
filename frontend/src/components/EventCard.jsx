"use client"

import { motion } from "framer-motion"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

export default function EventCard({ event, onUpdate }) {
  const handleStatusChange = async (newStatus) => {
    try {
      await axios.put(
        `${API_URL}/events/${event._id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      )
      onUpdate()
    } catch (err) {
      console.error("Failed to update event:", err)
    }
  }

  const handleDelete = async () => {
    if (confirm("Delete this event?")) {
      try {
        await axios.delete(`${API_URL}/events/${event._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        onUpdate()
      } catch (err) {
        console.error("Failed to delete event:", err)
      }
    }
  }

  const formatTime = (date) => new Date(date).toLocaleString()

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
    >
      <h3 className="text-xl font-bold text-black mb-2">{event.title}</h3>
      <p className="text-gray-600 text-sm mb-1">{formatTime(event.startTime)}</p>
      <p className="text-gray-600 text-sm mb-4">to {formatTime(event.endTime)}</p>

      <div className="flex gap-2 mb-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            event.status === "BUSY"
              ? "bg-red-100 text-red-700"
              : event.status === "SWAPPABLE"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {event.status}
        </span>
      </div>

      <div className="space-y-2">
        {event.status === "BUSY" && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleStatusChange("SWAPPABLE")}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition"
          >
            Make Swappable
          </motion.button>
        )}
        {event.status === "SWAPPABLE" && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleStatusChange("BUSY")}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-semibold transition"
          >
            Mark Busy
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDelete}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition"
        >
          Delete
        </motion.button>
      </div>
    </motion.div>
  )
}
