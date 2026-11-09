'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { categoryForType, formatDate, formatNok, type TransactionType } from '../lib/finance'

type Transaction = {
  id: string
  description: string
  amount: number
  type: TransactionType
  category: string
  occurredAt: string
}

type TypeFilter = 'all' | Transaction['type']
type EditValues = { description: string; amount: string; category: string; date: string }

function localDateValue(value: string): string {
  const date = new Date(value)
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}

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
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<EditValues | null>(null)
  const [savingEdit, setSavingEdit] = useState(false)

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

  function beginEdit(item: Transaction) {
    setError('')
    setEditingId(item.id)
    setEditValues({
      description: item.description,
      amount: (item.amount / 100).toFixed(2).replace('.', ','),
      category: item.category,
      date: localDateValue(item.occurredAt),
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setEditValues(null)
  }

  async function saveEdit(event: React.FormEvent<HTMLFormElement>, item: Transaction) {
    event.preventDefault()
    if (!editValues) return
    setError('')
    const description = editValues.description.trim()
    const normalizedAmount = editValues.amount.trim().replace(',', '.')
    if (!description || description.length > 120) {
      setError('Beskrivelsen må inneholde mellom 1 og 120 tegn.')
      return
    }
    if (!/^\d+(?:\.\d{1,2})?$/.test(normalizedAmount)) {
      setError('Beløpet må være positivt og ha maksimalt to desimaler.')
      return
    }
    const amount = Math.round(Number(normalizedAmount) * 100)
    if (!Number.isSafeInteger(amount) || amount <= 0) {
      setError('Beløpet er utenfor gyldig størrelse.')
      return
    }
    if (!categoryForType(item.type).includes(editValues.category)) {
      setError('Velg en gyldig kategori.')
      return
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(editValues.date) || Number.isNaN(Date.parse(`${editValues.date}T00:00:00`))) {
      setError('Velg en gyldig dato.')
      return
    }

    setSavingEdit(true)
    try {
      const response = await fetch(`/api/transactions/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, amount, category: editValues.category, date: editValues.date }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Kunne ikke oppdatere transaksjonen.')
      cancelEdit()
      await load()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Transaksjonen kunne ikke oppdateres.')
    } finally {
      setSavingEdit(false)
    }
  }

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
  if (error && !items.length) return <p className="form-error" role="alert">{error}</p>
  if (!items.length) return <p className="empty-state">Ingen transaksjoner registrert ennå.</p>

  return (
    <div className="transaction-list-wrap">
      {error && <p className="form-error transaction-action-error" role="alert">{error}</p>}
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
            <article key={item.id} className="tx-row-wrap">
              <div className="tx-row">
                <div className="tx-details">
                  <strong>{item.description}</strong>
                  <span className="small">{formatDate(item.occurredAt)} · {item.category}</span>
                </div>
                <div className="tx-amount">
                  <strong className={item.type === 'income' ? 'positive' : ''}>
                    {item.type === 'income' ? '+' : '−'}{formatNok(item.amount)}
                  </strong>
                  <div className="tx-actions">
                    <button className="text-action" onClick={() => beginEdit(item)} type="button" aria-label={`Rediger ${item.description}`}>
                      Rediger
                    </button>
                    <button className="delete-button" onClick={() => void del(item.id)} type="button" aria-label={`Slett ${item.description}`}>
                      Slett
                    </button>
                  </div>
                </div>
              </div>
              {editingId === item.id && editValues && (
                <form className="transaction-edit-form" onSubmit={(event) => void saveEdit(event, item)}>
                  <label className="field">
                    <span>Beskrivelse</span>
                    <input className="input" maxLength={120} required value={editValues.description} onChange={(event) => setEditValues({ ...editValues, description: event.target.value })} />
                  </label>
                  <label className="field">
                    <span>Beløp i kroner</span>
                    <input className="input" inputMode="decimal" required value={editValues.amount} onChange={(event) => setEditValues({ ...editValues, amount: event.target.value })} />
                  </label>
                  <label className="field">
                    <span>Kategori</span>
                    <select className="input" value={editValues.category} onChange={(event) => setEditValues({ ...editValues, category: event.target.value })}>
                      {categoryForType(item.type).map((category) => <option key={category} value={category}>{category}</option>)}
                    </select>
                  </label>
                  <label className="field">
                    <span>Dato</span>
                    <input className="input" type="date" required value={editValues.date} onChange={(event) => setEditValues({ ...editValues, date: event.target.value })} />
                  </label>
                  <div className="edit-actions">
                    <button className="button" type="submit" disabled={savingEdit}>{savingEdit ? 'Lagrer …' : 'Lagre endringer'}</button>
                    <button className="secondary-button" type="button" onClick={cancelEdit} disabled={savingEdit}>Avbryt</button>
                  </div>
                </form>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
