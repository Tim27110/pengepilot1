'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { formatDate, formatNok } from '../lib/finance'

type Transaction = {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  occurredAt: string
}

type TypeFilter = 'all' | Transaction['type']

export default function TransactionList({
  limit,
  refreshKey = 0,
  showFilters = false,
}: {
  limit?: number
  refreshKey?: number
  showFilters?: boolean
}) {
  const [items, setItems] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

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

  const categories = useMemo(
    () => Array.from(new Set(items.map((item) => item.category))).sort((a, b) => a.localeCompare(b, 'nb')),
    [items],
  )
  const filteredItems = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('nb-NO')
    return items.filter((item) => {
      const matchesSearch = !query || `${item.description} ${item.category}`.toLocaleLowerCase('nb-NO').includes(query)
      const matchesType = typeFilter === 'all' || item.type === typeFilter
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
      return matchesSearch && matchesType && matchesCategory
    })
  }, [categoryFilter, items, search, typeFilter])

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
    <div className="transaction-list-wrap">
      {showFilters && (
        <div className="transaction-filters" aria-label="Filtrer transaksjoner">
          <label className="field filter-search">
            <span>Søk</span>
            <input
              className="input"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Beskrivelse eller kategori"
            />
          </label>
          <label className="field">
            <span>Type</span>
            <select className="input" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as TypeFilter)}>
              <option value="all">Alle typer</option>
              <option value="income">Inntekter</option>
              <option value="expense">Utgifter</option>
            </select>
          </label>
          <label className="field">
            <span>Kategori</span>
            <select className="input" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              <option value="all">Alle kategorier</option>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </label>
          <p className="filter-result-count" aria-live="polite">
            Viser {filteredItems.length} av {items.length} transaksjoner
          </p>
        </div>
      )}
      {filteredItems.length === 0 ? (
        <p className="empty-state">Ingen transaksjoner samsvarer med filtrene.</p>
      ) : (
        <div className="transaction-list">
          {filteredItems.map((item) => (
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
      )}
    </div>
  )
}
