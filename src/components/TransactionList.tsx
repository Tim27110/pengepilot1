'use client'
import React, { useEffect, useState } from 'react'

function kr(cents:number){
  return new Intl.NumberFormat('nb-NO',{minimumFractionDigits:0,maximumFractionDigits:2}).format(cents/100) + ' kr'
}

export default function TransactionList({ limit }: { limit?: number }){
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function load(){
    setLoading(true)
    const res = await fetch('/api/transactions')
    if (!res.ok) { setItems([]); setLoading(false); return }
    const data = await res.json()
    if (limit) setItems(data.slice(0,limit))
    else setItems(data)
    setLoading(false)
  }

  useEffect(()=>{ load() }, [])

  async function del(id:string){
    if (!confirm('Slett transaksjon?')) return
    const res = await fetch(`/api/transactions/${id}`,{method:'DELETE'})
    if (res.ok) load()
    else alert('Slett feilet')
  }

  if (loading) return <div className="small">Laster...</div>
  if (!items.length) return <div className="small">Ingen transaksjoner</div>

  const income = items.filter(i=>i.type==='income').reduce((s,i)=>s+i.amount,0)
  const expenses = items.filter(i=>i.type==='expense').reduce((s,i)=>s+i.amount,0)

  return (
    <div>
      <div className="grid" style={{marginBottom:12}}>
        <div className="stat card"><div className="small">Inntekt</div><div style={{fontWeight:700}}>{kr(income)}</div></div>
        <div className="stat card"><div className="small">Utgifter</div><div style={{fontWeight:700}}>{kr(expenses)}</div></div>
        <div className="stat card"><div className="small">Til overs</div><div style={{fontWeight:700}}>{kr(income-expenses)}</div></div>
      </div>

      <div>
        {items.map(i=> (
          <div key={i.id} className="tx-row">
            <div>
              <div style={{fontWeight:700}}>{i.description}</div>
              <div className="small">{new Date(i.occurredAt).toISOString().slice(0,10)} · {i.category}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontWeight:700}}>{i.type==='income'?'+':'−'}{kr(i.amount)}</div>
              <button className="small" onClick={()=>del(i.id)}>Slett</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
