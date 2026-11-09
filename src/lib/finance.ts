export const EXPENSE_CATEGORIES = [
  'Mat',
  'Bolig',
  'Transport',
  'Abonnement',
  'Fritid',
  'Helse',
  'Annet',
] as const

export const INCOME_CATEGORY = 'Inntekt'

export const TRANSACTION_CATEGORIES = [...EXPENSE_CATEGORIES, INCOME_CATEGORY] as const

export type TransactionType = 'income' | 'expense'

export function categoryForType(type: TransactionType): string[] {
  return type === 'income' ? [INCOME_CATEGORY] : [...EXPENSE_CATEGORIES]
}

export function formatNok(amountOre: number): string {
  return `${new Intl.NumberFormat('nb-NO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amountOre / 100)} kr`
}

export function formatDate(date: Date | string): string {
  const value = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('nb-NO', { dateStyle: 'medium' }).format(value)
}
