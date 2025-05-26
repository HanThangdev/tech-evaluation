import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Get staking data
export async function GET() {
  try {
    const stakingData = await prisma.staking.findMany()
    return NextResponse.json({ data: stakingData })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch staking data' }, { status: 500 })
  }
}

// Create new stake
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, duration } = body

    const newStake = await prisma.staking.create({
      data: {
        amount,
        duration,
        status: 'ACTIVE'
      }
    })

    return NextResponse.json({ data: newStake })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create stake' }, { status: 500 })
  }
} 