import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { EXPENSE_CATEGORIES, INCOME_CATEGORY } from '../../../lib/finance'

const TxSchema = z.object({
  description: z.string().trim().min(1, 'Beskrivelse er påkrevd').max(120),
  amount: z.number().int().positive().safe(),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
}).superRefine((transaction, context) => {
  const allowedCategories = transaction.type === 'income' ? [INCOME_CATEGORY] : EXPENSE_CATEGORIES
  if (!allowedCategories.includes(transaction.category as never)) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['category'], message: 'Velg en gyldig kategori for transaksjonstypen.' })
  }
  if (transaction.date && Number.isNaN(Date.parse(`${transaction.date}T00:00:00`))) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['date'], message: 'Datoen er ugyldig.' })
  }
})

export async function GET() {
  try {
    const list = await prisma.mockTransaction.findMany({
      orderBy: [{ occurredAt: 'desc' }, { createdAt: 'desc' }],
    })
    return NextResponse.json(list)
  } catch (error) {
    console.error('GET /api/transactions error:', error)
    return NextResponse.json({ error: 'Kunne ikke hente transaksjoner' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const parsed = TxSchema.parse(await request.json())
    const occurredAt = parsed.date ? new Date(`${parsed.date}T00:00:00`) : new Date()
    const created = await prisma.mockTransaction.create({
      data: {
        description: parsed.description,
        amount: parsed.amount,
        type: parsed.type,
        category: parsed.category,
        occurredAt,
      },
    })
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? 'Ugyldige transaksjonsdata.' }, { status: 400 })
    }
    console.error('POST /api/transactions error:', error)
    return NextResponse.json({ error: 'Kunne ikke lagre transaksjon' }, { status: 500 })
  }
}
