'use client'

import React, { useState } from 'react'
import TransactionForm from '../../components/TransactionForm'
import TransactionList from '../../components/TransactionList'

export default function TransactionsPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="transactions-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">REGISTRERING</p>
          <h1>Transaksjoner</h1>
          <p className="muted">Legg til inntekter og utgifter for å holde oversikt over økonomien.</p>
        </div>
      </div>
      <section className="card panel">
        <div className="panel-heading">
          <div>
            <h2>Legg til transaksjon</h2>
            <p className="muted">Beløp lagres nøyaktig i øre.</p>
          </div>
        </div>
        <TransactionForm onSaved={() => setRefreshKey((key) => key + 1)} />
      </section>
      <section className="card panel">
        <div className="panel-heading">
          <div>
            <h2>Alle transaksjoner</h2>
            <p className="muted">Nyeste transaksjoner vises først.</p>
          </div>
        </div>
        <TransactionList refreshKey={refreshKey} />
      </section>
    </div>
  )
}
