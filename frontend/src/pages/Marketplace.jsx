"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import SlotCard from "../components/SlotCard"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

export default function Marketplace({ socket }) {
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSlots()
    if (socket) {
      socket.on("event-updated", (event) => {
        if (event.status === "SWAPPABLE") {
          setSlots((prev) => [event, ...prev.filter((s) => s._id !== event._id)])
        } else {
          setSlots((prev) => prev.filter((s) => s._id !== event._id))
        }
      })
    }
  }, [socket])

  const fetchSlots = async () => {
    try {
      const res = await axios.get(`${API_URL}/swappable-slots`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setSlots(res.data)
    } catch (err) {
      console.error("Failed to fetch slots:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-8">Available Slots</h1>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading slots...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slots.map((slot, idx) => (
              <motion.div
                key={slot._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <SlotCard slot={slot} onSwap={() => fetchSlots()} />
              </motion.div>
            ))}
          </div>
        )}

        {slots.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No slots available right now</p>
          </div>
        )}
      </div>
    </div>
  )
}
