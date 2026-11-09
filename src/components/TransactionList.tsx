'use client'

import React, { useEffect, useState } from 'react'
import { formatDate, formatNok } from '../lib/finance'

type Transaction = {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  occurredAt: string
}

export default function TransactionList({ limit, refreshKey = 0 }: { limit?: number; refreshKey?: number }) {
  const [items, setItems] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/transactions', { cache: 'no-store' })
      if (!response.ok) throw new Error('Kunne ikke hente transaksjoner.')
      const data: Transaction[] = await response.json()
      setItems(limit ? data.slice(0, limit) : data)
    } catch {
      setError('Transaksjonene kunne ikke lastes. Prøv igjen.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [limit, refreshKey])

  async function del(id: string) {
    if (!confirm('Vil du slette denne transaksjonen?')) return
    try {
      const response = await fetch(`/api/transactions/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Sletting feilet.')
      await load()
    } catch {
      setError('Transaksjonen kunne ikke slettes. Prøv igjen.')
    }
  }

  if (loading) return <p className="empty-state">Laster transaksjoner …</p>
  if (error) return <p className="form-error" role="alert">{error}</p>
  if (!items.length) return <p className="empty-state">Ingen transaksjoner registrert ennå.</p>

  return (
    <div className="transaction-list">
      {items.map((item) => (
        <article key={item.id} className="tx-row">
          <div className="tx-details">
            <strong>{item.description}</strong>
            <span className="small">{formatDate(item.occurredAt)} · {item.category}</span>
          </div>
          <div className="tx-amount">
            <strong className={item.type === 'income' ? 'positive' : ''}>
              {item.type === 'income' ? '+' : '−'}{formatNok(item.amount)}
            </strong>
            <button className="delete-button" onClick={() => void del(item.id)} type="button" aria-label={`Slett ${item.description}`}>
              Slett
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}
