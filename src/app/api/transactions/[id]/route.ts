import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import { z } from 'zod'

export async function GET(_req: Request, { params }: { params: { id: string } }){
  const id = params.id
  const tx = await prisma.mockTransaction.findUnique({ where: { id } })
  if (!tx) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(tx)
}

export async function PATCH(req: Request, { params }: { params: { id: string }}){
  try{
    const id = params.id
    const body = await req.json()
    const parsed = z.object({ description: z.string().optional(), amount: z.number().int().positive().optional(), category: z.string().optional(), date: z.string().optional() }).parse(body)
    const data:any = {}
    if (parsed.description) data.description = parsed.description
    if (parsed.amount) data.amount = parsed.amount
    if (parsed.category) data.category = parsed.category
    if (parsed.date) data.occurredAt = new Date(parsed.date)
    const updated = await prisma.mockTransaction.update({ where: { id }, data })
    return NextResponse.json(updated)
  }catch(e:any){ return NextResponse.json({ error: e?.message || String(e) }, { status: 400 }) }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }){
  const id = params.id
  await prisma.mockTransaction.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
