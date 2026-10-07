import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import { z } from 'zod'

export async function GET(_req: Request, { params }: { params: { id: string } }){
  const id = params.id
  try {
    const tx = await prisma.mockTransaction.findUnique({ where: { id } })
    if (!tx) return NextResponse.json({ error: 'Transaksjonen ble ikke funnet' }, { status: 404 })
    return NextResponse.json(tx)
  } catch (e: any) {
    console.error('GET /api/transactions/[id] error:', e)
    return NextResponse.json({ error: 'Kunne ikke hente transaksjonen' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string }}){
  try{
    const id = params.id
    const body = await req.json()
    const parsed = z.object({ description: z.string().optional(), amount: z.number().int().positive().optional(), category: z.string().optional(), date: z.string().optional() }).parse(body)

    const data: any = {}
    if (parsed.description !== undefined) data.description = parsed.description
    if (parsed.amount !== undefined) data.amount = parsed.amount
    if (parsed.category !== undefined) data.category = parsed.category
    if (parsed.date !== undefined) data.occurredAt = new Date(parsed.date)

    try {
      const updated = await prisma.mockTransaction.update({ where: { id }, data })
      return NextResponse.json(updated)
    } catch (dbErr: any) {
      // Prisma throws a known error code for "Record to update not found." (P2025)
      if (dbErr?.code === 'P2025' || /not found/i.test(String(dbErr?.message || ''))) {
        return NextResponse.json({ error: 'Transaksjonen ble ikke funnet' }, { status: 404 })
      }
      console.error('PATCH /api/transactions/[id] DB error:', dbErr)
      return NextResponse.json({ error: 'Kunne ikke oppdatere transaksjonen' }, { status: 500 })
    }
  }catch(e:any){
    if (e?.name === 'ZodError') {
      return NextResponse.json({ error: e.message }, { status: 400 })
    }
    console.error('PATCH /api/transactions/[id] error:', e)
    return NextResponse.json({ error: 'Ugyldig forespørsel' }, { status: 400 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }){
  const id = params.id
  try {
    try {
      await prisma.mockTransaction.delete({ where: { id } })
      return NextResponse.json({ ok: true })
    } catch (dbErr: any) {
      if (dbErr?.code === 'P2025' || /not found/i.test(String(dbErr?.message || ''))) {
        return NextResponse.json({ error: 'Transaksjonen ble ikke funnet' }, { status: 404 })
      }
      console.error('DELETE /api/transactions/[id] DB error:', dbErr)
      return NextResponse.json({ error: 'Kunne ikke slette transaksjonen' }, { status: 500 })
    }
  } catch (e: any) {
    console.error('DELETE /api/transactions/[id] error:', e)
    return NextResponse.json({ error: 'Kunne ikke slette transaksjonen' }, { status: 500 })
  }
}
