"use client"

import { useEffect, useState } from "react"
import { useSocket } from "@/hooks/use-socket"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Notification {
  id: string
  type: "success" | "error" | "info" | "warning"
  title: string
  message: string
  timestamp: Date
  read: boolean
}

export function NotificationCenter() {
  const { socket, isConnected } = useSocket()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!socket) return

    const handleSwapNotification = (data: any) => {
      const notification: Notification = {
        id: Date.now().toString(),
        type: data.status === "completed" ? "success" : "info",
        title: data.type === "swap_completed" ? "Swap Completed" : "Swap Update",
        message: `${data.fromAmount} ${data.fromToken} → ${data.toAmount} ${data.toToken}`,
        timestamp: new Date(),
        read: false,
      }
      setNotifications((prev) => [notification, ...prev])
    }

    const handlePriceAlert = (data: any) => {
      const notification: Notification = {
        id: Date.now().toString(),
        type: "warning",
        title: "Price Alert",
        message: `${data.token} price changed by ${data.change}%`,
        timestamp: new Date(),
        read: false,
      }
      setNotifications((prev) => [notification, ...prev])
    }

    socket.on("swap_completed", handleSwapNotification)
    socket.on("price_alert", handlePriceAlert)
    socket.on("swap_update", handleSwapNotification)

    return () => {
      socket.off("swap_completed", handleSwapNotification)
      socket.off("price_alert", handlePriceAlert)
      socket.off("swap_update", handleSwapNotification)
    }
  }, [socket])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="relative">
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-destructive text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-12 w-80 z-50 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Notifications</CardTitle>
              {notifications.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs">
                  Clear All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto space-y-2">
            {notifications.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">No notifications</p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    notif.read ? "bg-muted" : "bg-secondary"
                  }`}
                  onClick={() => markAsRead(notif.id)}
                >
                  <p className="font-medium text-sm">{notif.title}</p>
                  <p className="text-xs text-muted-foreground">{notif.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notif.timestamp.toLocaleTimeString()}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
