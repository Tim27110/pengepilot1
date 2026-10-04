import React from 'react'
import TransactionList from '../components/TransactionList'

export default async function Page() {
  return (
    <div>
      <h1>Oversikt</h1>
      <div className="grid">
        <div className="stat card">
          <div className="small">Inntekt</div>
          <div id="income" style={{fontSize:20,fontWeight:700}}>– kr</div>
        </div>
        <div className="stat card">
          <div className="small">Utgifter</div>
          <div id="expenses" style={{fontSize:20,fontWeight:700}}>– kr</div>
        </div>
        <div className="stat card">
          <div className="small">Til overs</div>
          <div id="left" style={{fontSize:20,fontWeight:700}}>– kr</div>
        </div>
      </div>

      <div className="card">
        <h2>Siste transaksjoner</h2>
        <TransactionList limit={8} />
      </div>
    </div>
  )
}
