"use client"

import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"

export default function Navbar({ onLogout, user }) {
  const location = useLocation()

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/marketplace", label: "Marketplace" },
    { path: "/requests", label: "Requests" },
  ]

  return (
    <nav className="bg-black text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold">
          SlotSwapper
        </Link>

        <div className="flex gap-8 items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`transition ${
                location.pathname === item.path ? "text-red-500 font-semibold" : "text-gray-300 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </motion.button>
      </div>
    </nav>
  )
}
