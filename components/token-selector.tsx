"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface TokenSelectorProps {
  selected: string
  onSelect: (token: string) => void
  disabled?: boolean
}

const AVAILABLE_TOKENS = ["ETH", "USDC", "DAI", "USDT", "WBTC"]

export function TokenSelector({ selected, onSelect, disabled }: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")

  const filtered = AVAILABLE_TOKENS.filter((token) => token.toLowerCase().includes(search.toLowerCase()))

  if (isOpen) {
    return (
      <Card className="absolute top-12 left-0 right-0 z-50">
        <CardHeader>
          <CardTitle className="text-lg">Select Token</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Search tokens..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <div className="space-y-2">
            {filtered.map((token) => (
              <Button
                key={token}
                variant={token === selected ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => {
                  onSelect(token)
                  setIsOpen(false)
                  setSearch("")
                }}
              >
                {token}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Button variant="outline" onClick={() => setIsOpen(true)} disabled={disabled} className="relative">
      {selected}
    </Button>
  )
}
