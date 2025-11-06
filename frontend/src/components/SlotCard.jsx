"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

export default function SlotCard({ slot, onSwap }) {
  const [showModal, setShowModal] = useState(false)
  const [mySlots, setMySlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState("")

  const fetchMySlots = async () => {
    try {
      const res = await axios.get(`${API_URL}/events/my`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      const swappable = res.data.filter((e) => e.status === "SWAPPABLE")
      setMySlots(swappable)
    } catch (err) {
      console.error("Failed to fetch my slots:", err)
    }
  }

  const handleRequestSwap = async () => {
    if (!selectedSlot) return
    try {
      await axios.post(
        `${API_URL}/swap-request`,
        {
          mySlotId: selectedSlot,
          theirSlotId: slot._id,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      )
      setShowModal(false)
      onSwap()
    } catch (err) {
      console.error("Failed to request swap:", err)
    }
  }

  const formatTime = (date) => new Date(date).toLocaleString()

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
      >
        <h3 className="text-xl font-bold text-black mb-2">{slot.title}</h3>
        <p className="text-gray-600 text-sm mb-1">{formatTime(slot.startTime)}</p>
        <p className="text-gray-600 text-sm mb-4">to {formatTime(slot.endTime)}</p>
        <p className="text-gray-600 mb-4 text-sm">
          By <span className="font-semibold">{slot.owner?.name}</span>
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            fetchMySlots()
            setShowModal(true)
          }}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
        >
          Request Swap
        </motion.button>
      </motion.div>

      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold text-black mb-4">Select Your Slot</h2>
            {mySlots.length === 0 ? (
              <p className="text-gray-600 mb-6">You have no swappable slots</p>
            ) : (
              <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
                {mySlots.map((s) => (
                  <label
                    key={s._id}
                    className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="slot"
                      value={s._id}
                      checked={selectedSlot === s._id}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-semibold text-black">{s.title}</p>
                      <p className="text-xs text-gray-600">{formatTime(s.startTime)}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-300 text-black py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRequestSwap}
                disabled={!selectedSlot}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50"
              >
                Request
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}
