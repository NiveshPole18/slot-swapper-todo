"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import EventCard from "../components/EventCard"
import EventForm from "../components/EventForm"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

export default function Dashboard({ socket }) {
  const [events, setEvents] = useState([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchEvents()
    if (socket) {
      socket.on("event-created", (event) => setEvents((prev) => [event, ...prev]))
      socket.on("event-updated", (event) => setEvents((prev) => prev.map((e) => (e._id === event._id ? event : e))))
      socket.on("event-deleted", (id) => setEvents((prev) => prev.filter((e) => e._id !== id)))
    }
  }, [socket])

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/events/my`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setEvents(res.data)
    } catch (err) {
      console.error("Failed to fetch events:", err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-black">My Schedule</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg"
          >
            {showForm ? "Cancel" : "+ New Event"}
          </motion.button>
        </div>

        {showForm && (
          <EventForm
            onSubmit={(event) => {
              setEvents([event, ...events])
              setShowForm(false)
            }}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, idx) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <EventCard event={event} onUpdate={() => fetchEvents()} />
            </motion.div>
          ))}
        </div>

        {events.length === 0 && !showForm && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No events yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}
