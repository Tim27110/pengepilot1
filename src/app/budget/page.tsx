import React from 'react'
import { formatNok } from '../../lib/finance'
import { getFinancialTransactions, monthTransactions, sumType } from '../../lib/financial-summary'

export const dynamic = 'force-dynamic'

export default async function BudgetPage() {
  const transactions = await getFinancialTransactions()
  const currentMonth = monthTransactions(transactions)
  const spent = sumType(currentMonth, 'expense')
  const categories = new Map<string, number>()
  for (const transaction of currentMonth) {
    if (transaction.type === 'expense') categories.set(transaction.category, (categories.get(transaction.category) ?? 0) + transaction.amount)
  }
  const orderedCategories = Array.from(categories.entries()).sort((a, b) => b[1] - a[1])

  return (
    <div className="product-page">
      <header className="page-heading">
        <div><p className="eyebrow">MÅNEDSPLAN</p><h1>Budsjett</h1><p className="muted">Følg forbruket ditt mot en plan. Budsjettgrenser kan kobles på når lagring for budsjett er bygget.</p></div>
      </header>
      <section className="summary-grid budget-summary" aria-label="Budsjettstatus denne måneden">
        <article className="summary-card"><span className="summary-label">Månedlig budsjett</span><strong className="summary-value">Ikke satt</strong><span className="summary-note">Ingen budsjettgrense er lagret</span></article>
        <article className="summary-card"><span className="summary-label">Brukt denne måneden</span><strong className="summary-value">{formatNok(spent)}</strong><span className="summary-note">Fra registrerte utgifter</span></article>
        <article className="summary-card"><span className="summary-label">Gjenstår</span><strong className="summary-value">—</strong><span className="summary-note">Sett et budsjett for å beregne restbeløp</span></article>
      </section>
      <section className="card panel">
        <div className="panel-heading"><div><h2>Forbruk per kategori</h2><p className="muted">Faktiske registreringer denne måneden · beløpene er ikke budsjettgrenser</p></div></div>
        {orderedCategories.length ? <div className="category-list">
          {orderedCategories.map(([category, amount]) => <div className="category-item" key={category}>
            <div className="category-heading"><span>{category}</span><strong>{formatNok(amount)}</strong></div>
            <div className="category-track" role="img" aria-label={`${category}: ${spent ? Math.round(amount / spent * 100) : 0} prosent av registrerte utgifter`}><div className="category-fill" style={{ width: `${spent ? amount / spent * 100 : 0}%` }} /></div>
            <p className="small budget-unset">Budsjett ikke satt</p>
          </div>)}
        </div> : <p className="empty-state">Ingen utgifter registrert denne måneden. Registrerte utgifter vises her når de finnes.</p>}
      </section>
      <p className="disclaimer">Kategorifordelingen viser registrerte transaksjoner, ikke et komplett budsjett. Budsjettgrenser og fremdriftsvarsler krever en senere budsjettdatamodell.</p>
    </div>
  )
}
