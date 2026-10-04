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

export async function GET() {
  const list = await prisma.mockTransaction.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(list)
}

export async function POST(req: Request) {
  try{
    const body = await req.json()
    const parsed = TxSchema.parse(body)
    const occurredAt = parsed.date ? new Date(parsed.date) : new Date()
    const created = await prisma.mockTransaction.create({ data: {
      description: parsed.description,
      amount: parsed.amount,
      type: parsed.type,
      category: parsed.category,
      occurredAt
    }})
    return NextResponse.json(created, { status: 201 })
  }catch(e:any){
    return NextResponse.json({ error: e?.message || String(e) }, { status: 400 })
  }
}
