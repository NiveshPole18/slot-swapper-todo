"use client"

import { motion } from "framer-motion"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

export default function SwapRequestCard({ request, isIncoming, onRespond }) {
  const handleRespond = async (accept) => {
    try {
      await axios.post(
        `${API_URL}/swap-response/${request._id}`,
        { accept },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      )
      onRespond?.()
    } catch (err) {
      console.error("Failed to respond to swap:", err)
    }
  }

  const formatTime = (date) => new Date(date).toLocaleString()
  const statusColor = request.status === "PENDING" ? "yellow" : request.status === "ACCEPTED" ? "green" : "red"

  return (
    <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
      <div className="mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${statusColor}-100 text-${statusColor}-700`}>
          {request.status}
        </span>
      </div>

      {isIncoming ? (
        <>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">{request.requester?.name}</span> wants to swap
          </p>
          <div className="space-y-3 mb-4 text-sm">
            <div className="bg-gray-50 p-3 rounded">
              <p className="font-semibold text-black">{request.requesterSlot?.title}</p>
              <p className="text-gray-600">{formatTime(request.requesterSlot?.startTime)}</p>
            </div>
            <div className="text-center text-gray-400 font-semibold">↔</div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="font-semibold text-black">{request.responderSlot?.title}</p>
              <p className="text-gray-600">{formatTime(request.responderSlot?.startTime)}</p>
            </div>
          </div>
          {request.status === "PENDING" && (
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRespond(false)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition"
              >
                Reject
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRespond(true)}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition"
              >
                Accept
              </motion.button>
            </div>
          )}
        </>
      ) : (
        <>
          <p className="text-gray-600 mb-2">
            Waiting for <span className="font-semibold">{request.responder?.name}</span>
          </p>
          <div className="space-y-3 text-sm">
            <div className="bg-gray-50 p-3 rounded">
              <p className="font-semibold text-black">{request.requesterSlot?.title}</p>
              <p className="text-gray-600">{formatTime(request.requesterSlot?.startTime)}</p>
            </div>
            <div className="text-center text-gray-400 font-semibold">↔</div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="font-semibold text-black">{request.responderSlot?.title}</p>
              <p className="text-gray-600">{formatTime(request.responderSlot?.startTime)}</p>
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}
