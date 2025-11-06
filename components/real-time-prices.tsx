"use client"

import { useEffect, useState } from "react"
import { useSocket } from "@/hooks/use-socket"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TokenPrice {
  token: string
  price: number
  change24h: number
}

export function RealTimePrices() {
  const { socket, isConnected } = useSocket()
  const [prices, setPrices] = useState<TokenPrice[]>([
    { token: "ETH", price: 2500, change24h: 2.5 },
    { token: "USDC", price: 1, change24h: 0 },
    { token: "DAI", price: 1, change24h: 0.1 },
    { token: "USDT", price: 1, change24h: 0 },
    { token: "WBTC", price: 45000, change24h: -1.2 },
  ])

  useEffect(() => {
    if (!socket) return

    const handlePriceUpdate = (data: any) => {
      setPrices((prev) =>
        prev.map((p) => (p.token === data.token ? { ...p, price: data.price, change24h: data.change24h } : p)),
      )
    }

    socket.on("price_update", handlePriceUpdate)

    return () => {
      socket.off("price_update", handlePriceUpdate)
    }
  }, [socket])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">
          Live Prices
          {isConnected && <span className="text-xs text-green-600 ml-2">● Live</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {prices.map((tokenPrice) => (
            <div key={tokenPrice.token} className="flex justify-between items-center p-2 bg-secondary/50 rounded">
              <span className="font-medium">{tokenPrice.token}</span>
              <div className="text-right">
                <p className="font-semibold">${tokenPrice.price.toFixed(2)}</p>
                <p className={`text-xs ${tokenPrice.change24h >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {tokenPrice.change24h >= 0 ? "+" : ""}
                  {tokenPrice.change24h.toFixed(2)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
