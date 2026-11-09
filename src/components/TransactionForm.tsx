'use client'

import React, { useState } from 'react'
import { categoryForType, type TransactionType } from '../lib/finance'

function localDateValue(): string {
  const today = new Date()
  const offset = today.getTimezoneOffset() * 60_000
  return new Date(today.getTime() - offset).toISOString().slice(0, 10)
}

export default function TransactionForm({ onSaved }: { onSaved?: () => void }) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<TransactionType>('expense')
  const [category, setCategory] = useState('Mat')
  const [date, setDate] = useState(localDateValue)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const categories = categoryForType(type)

  function changeType(nextType: TransactionType) {
    setType(nextType)
    setCategory(nextType === 'income' ? 'Inntekt' : 'Mat')
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const cleanDescription = description.trim()
    const normalizedAmount = amount.trim().replace(',', '.')

    if (!cleanDescription) {
      setError('Skriv inn en beskrivelse.')
      return
    }
    if (cleanDescription.length > 120) {
      setError('Beskrivelsen kan ikke være lengre enn 120 tegn.')
      return
    }
    if (!/^\d+(?:\.\d{1,2})?$/.test(normalizedAmount)) {
      setError('Skriv inn et positivt beløp med maksimalt to desimaler.')
      return
    }
    const value = Number(normalizedAmount)
    const amountOre = Math.round(value * 100)
    if (!Number.isSafeInteger(amountOre) || amountOre <= 0) {
      setError('Beløpet må være større enn 0 og innenfor gyldig størrelse.')
      return
    }
    if (!date || Number.isNaN(Date.parse(`${date}T00:00:00`))) {
      setError('Velg en gyldig dato.')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: cleanDescription, amount: amountOre, type, category, date }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Lagring feilet.')
      setDescription('')
      setAmount('')
      onSaved?.()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Lagring feilet. Prøv igjen.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <label className="field field-wide">
        <span>Beskrivelse</span>
        <input className="input" value={description} onChange={(event) => setDescription(event.target.value)} maxLength={120} required />
      </label>
      <label className="field">
        <span>Beløp</span>
        <div className="amount-input">
          <input className="input" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0,00" required aria-describedby="amount-help" />
          <span>kr</span>
        </div>
        <span className="field-hint" id="amount-help">Bruk komma eller punktum, maks to desimaler.</span>
      </label>
      <label className="field">
        <span>Type</span>
        <select className="input" value={type} onChange={(event) => changeType(event.target.value as TransactionType)}>
          <option value="expense">Utgift</option>
          <option value="income">Inntekt</option>
        </select>
      </label>
      <label className="field">
        <span>Kategori</span>
        <select className="input" value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      <label className="field">
        <span>Dato</span>
        <input className="input" type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
      </label>
      {error && <p className="form-error field-wide" role="alert">{error}</p>}
      <div className="form-actions field-wide">
        <button className="button" type="submit" disabled={saving}>{saving ? 'Lagrer …' : 'Lagre transaksjon'}</button>
      </div>
    </form>
  )
}
