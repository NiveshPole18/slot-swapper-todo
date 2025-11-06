"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import SwapRequestCard from "../components/SwapRequestCard"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

export default function Requests({ socket }) {
  const [incoming, setIncoming] = useState([])
  const [outgoing, setOutgoing] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
    if (socket) {
      socket.on("swap-request", (data) => {
        setIncoming((prev) => [data.swapRequest, ...prev])
      })
      socket.on("swap-response", (data) => {
        setOutgoing((prev) => prev.map((r) => (r._id === data.swapRequest._id ? data.swapRequest : r)))
      })
    }
  }, [socket])

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_URL}/my-swap-requests`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setIncoming(res.data.incoming)
      setOutgoing(res.data.outgoing)
    } catch (err) {
      console.error("Failed to fetch requests:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-8">Swap Requests</h1>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading requests...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-black mb-4">Incoming</h2>
              <div className="space-y-4">
                {incoming.map((request, idx) => (
                  <motion.div
                    key={request._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <SwapRequestCard request={request} isIncoming onRespond={() => fetchRequests()} />
                  </motion.div>
                ))}
                {incoming.length === 0 && <p className="text-gray-500">No incoming requests</p>}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-black mb-4">Outgoing</h2>
              <div className="space-y-4">
                {outgoing.map((request, idx) => (
                  <motion.div
                    key={request._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <SwapRequestCard request={request} isIncoming={false} />
                  </motion.div>
                ))}
                {outgoing.length === 0 && <p className="text-gray-500">No outgoing requests</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
