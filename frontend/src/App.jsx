"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import io from "socket.io-client"
import SignUp from "./pages/SignUp"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Marketplace from "./pages/Marketplace"
import Requests from "./pages/Requests"
import Navbar from "./components/Navbar"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000"

export const apiClient = axios.create({ baseURL: API_URL })

let socket

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (token) {
      apiClient.defaults.headers.authorization = `Bearer ${token}`
      socket = io(SOCKET_URL, { query: { token } })
    }
  }, [token])

  const handleLogout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("token")
    delete apiClient.defaults.headers.authorization
  }

  const ProtectedRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />
  }

  return (
    <Router>
      {token && <Navbar onLogout={handleLogout} user={user} />}
      <Routes>
        <Route path="/signup" element={<SignUp setToken={setToken} />} />
        <Route path="/login" element={<Login setToken={setToken} setUser={setUser} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard socket={socket} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketplace"
          element={
            <ProtectedRoute>
              <Marketplace socket={socket} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <Requests socket={socket} />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
