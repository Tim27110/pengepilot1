import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'
import { z } from 'zod'

const TxSchema = z.object({
  description: z.string().min(1),
  amount: z.number().int().positive(), // amount in øre
  type: z.enum(['income','expense']),
  category: z.string().min(1),
  date: z.string().optional()
})

export async function GET(req: Request) {
  try {
    const list = await prisma.mockTransaction.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(list)
  } catch (e: any) {
    console.error('GET /api/transactions error:', e)
    return NextResponse.json({ error: 'Kunne ikke hente transaksjoner' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = TxSchema.parse(body)
    const occurredAt = parsed.date ? new Date(parsed.date) : new Date()
    try {
      const created = await prisma.mockTransaction.create({ data: {
        description: parsed.description,
        amount: parsed.amount,
        type: parsed.type,
        category: parsed.category,
        occurredAt
      }})
      return NextResponse.json(created, { status: 201 })
    } catch (dbErr: any) {
      console.error('DB create error:', dbErr)
      return NextResponse.json({ error: 'Kunne ikke lagre transaksjon' }, { status: 500 })
    }
  } catch (e: any) {
    // Validation error or parsing error
    if (e?.name === 'ZodError') {
      return NextResponse.json({ error: e.message }, { status: 400 })
    }
    console.error('POST /api/transactions error:', e)
    return NextResponse.json({ error: 'Ugyldig forespørsel' }, { status: 400 })
  }
}
