import prisma from './prisma'

export type FinancialTransaction = {
  id: string
  description: string
  amount: number
  type: string
  category: string
  occurredAt: Date
}

export type MonthSummary = {
  key: string
  label: string
  income: number
  expenses: number
}

export function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export async function getFinancialTransactions(): Promise<FinancialTransaction[]> {
  return prisma.mockTransaction.findMany({
    orderBy: [{ occurredAt: 'desc' }, { createdAt: 'desc' }],
  })
}

export function summarizeMonths(transactions: FinancialTransaction[], now = new Date()): MonthSummary[] {
  const totals = new Map<string, { income: number; expenses: number }>()
  for (const transaction of transactions) {
    const key = monthKey(transaction.occurredAt)
    const month = totals.get(key) ?? { income: 0, expenses: 0 }
    if (transaction.type === 'income') month.income += transaction.amount
    if (transaction.type === 'expense') month.expenses += transaction.amount
    totals.set(key, month)
  }

  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
    const key = monthKey(date)
    const values = totals.get(key) ?? { income: 0, expenses: 0 }
    return {
      key,
      label: new Intl.DateTimeFormat('nb-NO', { month: 'short' }).format(date),
      ...values,
    }
  })
}

export function monthTransactions(transactions: FinancialTransaction[], now = new Date()): FinancialTransaction[] {
  const current = monthKey(now)
  return transactions.filter((transaction) => monthKey(transaction.occurredAt) === current)
}

export function sumType(transactions: FinancialTransaction[], type: 'income' | 'expense'): number {
  return transactions.reduce((sum, transaction) => sum + (transaction.type === type ? transaction.amount : 0), 0)
}
