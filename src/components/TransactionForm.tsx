'use client'
import React, { useState } from 'react'

const categories = ['Mat','Bolig','Transport','Abonnement','Fritid','Helse','Annet']

export default function TransactionForm({ onSaved }: { onSaved?: () => void }){
  const [desc, setDesc] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'expense'|'income'>('expense')
  const [cat, setCat] = useState(categories[0])
  const [date, setDate] = useState(new Date().toISOString().slice(0,10))
  const [err, setErr] = useState('')

  function fmtKr(n:number){
    return new Intl.NumberFormat('nb-NO',{minimumFractionDigits:0,maximumFractionDigits:2}).format(n/100) + ' kr'
  }

  async function handleSubmit(e:React.FormEvent){
    e.preventDefault()
    setErr('')
    if (!desc || !amount) { setErr('Fyll inn beskrivelse og beløp'); return }
    const parsed = parseFloat(amount.replace(',','.'))
    if (isNaN(parsed) || parsed <= 0) { setErr('Beløp må være et tall større enn 0'); return }
    const cents = Math.round(parsed * 100)
    const payload = { description: desc, amount: cents, type, category: cat, date }
    try{
      const res = await fetch('/api/transactions', { method: 'POST', body: JSON.stringify(payload), headers: {'Content-Type':'application/json'} })
      if (!res.ok) throw new Error(await res.text())
      setDesc(''); setAmount(''); if (onSaved) onSaved()
    }catch(err:any){ setErr(err.message || 'Lagring feilet') }
  }

  return (
    <form onSubmit={handleSubmit} className="form-row">
      <input className="input" value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Beskrivelse" />
      <input className="input" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Beløp (eks: 123.45)" />
      <select className="input" value={type} onChange={e=>setType(e.target.value as any)}>
        <option value="expense">Utgift</option>
        <option value="income">Inntekt</option>
      </select>
      <select className="input" value={cat} onChange={e=>setCat(e.target.value)}>
        {categories.map(c=> <option key={c}>{c}</option>)}
      </select>
      <input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} />
      <button className="button" type="submit">Lagre</button>
      {err && <div className="small" style={{color:'var(--danger)'}}>{err}</div>}
    </form>
  )
}
