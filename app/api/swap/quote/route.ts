import { type NextRequest, NextResponse } from "next/server"

interface QuoteRequest {
  fromToken: string
  toToken: string
  amount: string
}

interface TokenPrice {
  [key: string]: number
}

// Mock token prices (in real app, fetch from price oracle)
const TOKEN_PRICES: TokenPrice = {
  ETH: 2500,
  USDC: 1,
  DAI: 1,
  USDT: 1,
  WBTC: 45000,
}

function calculateRate(fromToken: string, toToken: string): number {
  const fromPrice = TOKEN_PRICES[fromToken] || 1
  const toPrice = TOKEN_PRICES[toToken] || 1

  // Apply 0.3% fee
  return (fromPrice / toPrice) * 0.997
}

export async function POST(request: NextRequest) {
  try {
    const body: QuoteRequest = await request.json()
    const { fromToken, toToken, amount } = body

    if (!fromToken || !toToken || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const rate = calculateRate(fromToken, toToken)
    const toAmount = (Number.parseFloat(amount) * rate).toFixed(6)

    return NextResponse.json(
      {
        fromToken,
        toToken,
        fromAmount: amount,
        toAmount,
        rate,
        fee: "0.3%",
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Failed to calculate quote" }, { status: 500 })
  }
}
