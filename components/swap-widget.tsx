"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useSocket } from "@/hooks/use-socket"

interface SwapWidgetProps {
  onSwapComplete?: (data: any) => void
}

export function SwapWidget({ onSwapComplete }: SwapWidgetProps) {
  const [fromToken, setFromToken] = useState("ETH")
  const [toToken, setToToken] = useState("USDC")
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { socket } = useSocket()

  const handleSwapCalculation = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFromAmount(value)

    if (!value) {
      setToAmount("")
      return
    }

    try {
      const response = await fetch("/api/swap/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromToken, toToken, amount: value }),
      })

      if (!response.ok) throw new Error("Failed to get quote")
      const data = await response.json()
      setToAmount(data.toAmount)
    } catch (error) {
      toast({ title: "Error", description: "Failed to calculate swap", variant: "destructive" })
    }
  }

  const handleSwap = async () => {
    if (!fromAmount || !toAmount) return

    setLoading(true)
    try {
      const response = await fetch("/api/swap/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromToken, toToken, fromAmount, toAmount }),
      })

      if (!response.ok) throw new Error("Swap failed")
      const data = await response.json()

      if (socket) {
        socket.emit("swap_initiated", {
          fromToken,
          toToken,
          fromAmount,
          toAmount,
          transactionHash: data.transactionHash,
        })
      }

      toast({ title: "Success", description: `Swap executed: ${data.transactionHash}` })
      onSwapComplete?.(data)
      setFromAmount("")
      setToAmount("")
    } catch (error) {
      toast({ title: "Error", description: "Swap execution failed", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleTokenSwitch = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount("")
    setToAmount("")
  }

  return (
    <Card className="border-2 w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Token Swap</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="from-amount" className="text-sm font-medium">
            From
          </Label>
          <div className="flex gap-2">
            <Input
              id="from-amount"
              type="number"
              placeholder="0.0"
              value={fromAmount}
              onChange={handleSwapCalculation}
              className="flex-1"
            />
            <Button variant="outline" className="px-4 bg-transparent">
              {fromToken}
            </Button>
          </div>
        </div>

        <div className="flex justify-center">
          <Button variant="ghost" className="rounded-full h-10 w-10 p-0" onClick={handleTokenSwitch}>
            ⇅
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="to-amount" className="text-sm font-medium">
            To
          </Label>
          <div className="flex gap-2">
            <Input id="to-amount" type="number" placeholder="0.0" value={toAmount} disabled className="flex-1" />
            <Button variant="outline" className="px-4 bg-transparent">
              {toToken}
            </Button>
          </div>
        </div>

        <Button onClick={handleSwap} disabled={loading || !fromAmount || !toAmount} className="w-full">
          {loading ? "Swapping..." : "Swap"}
        </Button>
      </CardContent>
    </Card>
  )
}
