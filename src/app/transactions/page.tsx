'use client'
import React from 'react'
import TransactionForm from '../../components/TransactionForm'
import TransactionList from '../../components/TransactionList'

export default function TransactionsPage() {
  return (
    <div>
      <h1>Transaksjoner</h1>
      <div className="card">
        <h2>Legg til transaksjon</h2>
        <TransactionForm />
      </div>
      <div className="card">
        <h2>Alle transaksjoner</h2>
        <TransactionList />
      </div>
    </div>
  )
}
