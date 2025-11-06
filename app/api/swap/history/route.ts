import { type NextRequest, NextResponse } from "next/server"

// Mock swap history
const MOCK_HISTORY = [
  {
    id: "1",
    fromToken: "ETH",
    toToken: "USDC",
    fromAmount: "1.5",
    toAmount: "3750",
    transactionHash: "0x1234567890abcdef",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: "completed",
  },
  {
    id: "2",
    fromToken: "USDC",
    toToken: "DAI",
    fromAmount: "1000",
    toAmount: "999.7",
    transactionHash: "0xabcdef1234567890",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    status: "completed",
  },
]

export async function GET(request: NextRequest) {
  try {
    // In a real app, this would fetch from database
    return NextResponse.json(
      {
        success: true,
        history: MOCK_HISTORY,
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
  }
}
