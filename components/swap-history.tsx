"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface SwapTransaction {
  id: string
  fromToken: string
  toToken: string
  fromAmount: string
  toAmount: string
  transactionHash: string
  timestamp: string
  status: string
}

export function SwapHistory() {
  const [history, setHistory] = useState<SwapTransaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/swap/history")
      if (!response.ok) throw new Error("Failed to fetch history")
      const data = await response.json()
      setHistory(data.history)
    } catch (error) {
      console.error("Failed to fetch swap history:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center p-4">Loading...</div>
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Swap History</CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No swaps yet</p>
        ) : (
          <div className="space-y-4">
            {history.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">
                    {tx.fromAmount} {tx.fromToken} → {tx.toAmount} {tx.toToken}
                  </p>
                  <p className="text-xs text-muted-foreground">{new Date(tx.timestamp).toLocaleDateString()}</p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <a href={`https://etherscan.io/tx/${tx.transactionHash}`} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
