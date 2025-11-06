"use client"

import type React from "react"
import { SwapWidget } from "@/components/swap-widget"
import { SwapHistory } from "@/components/swap-history"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function SwapPage() {
  const [fromToken, setFromToken] = useState("ETH")
  const [toToken, setToToken] = useState("USDC")
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [swapCompleted, setSwapCompleted] = useState(false)

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

      toast({ title: "Success", description: `Swap executed: ${data.transactionHash}` })
      setFromAmount("")
      setToAmount("")
      setSwapCompleted(!swapCompleted)
    } catch (error) {
      toast({ title: "Error", description: "Swap execution failed", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Token Swap Exchange</h1>
          <p className="text-muted-foreground">Swap tokens instantly with competitive rates</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="flex justify-center md:justify-end">
            <SwapWidget onSwapComplete={handleSwap} />
          </div>
          <div className="flex justify-center md:justify-start">
            <SwapHistory key={swapCompleted.toString()} />
          </div>
        </div>
      </div>
    </main>
  )
}
