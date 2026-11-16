import React from 'react'
import { formatNok } from '../../lib/finance'
import { getFinancialTransactions, monthTransactions, sumType, summarizeMonths } from '../../lib/financial-summary'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const transactions = await getFinancialTransactions()
  const now = new Date()
  const months = summarizeMonths(transactions, now)
  const current = monthTransactions(transactions, now)
  const income = sumType(current, 'income')
  const expenses = sumType(current, 'expense')
  const savings = income - expenses
  const max = Math.max(0, ...months.flatMap((month) => [month.income, month.expenses]))
  const categories = new Map<string, number>()
  for (const transaction of current) if (transaction.type === 'expense') categories.set(transaction.category, (categories.get(transaction.category) ?? 0) + transaction.amount)
  const rankedCategories = Array.from(categories.entries()).sort((a, b) => b[1] - a[1])
  const firstPopulated = months.find((month) => month.income || month.expenses)
  const lastPopulated = [...months].reverse().find((month) => month.income || month.expenses)

  return (
    <div className="product-page">
      <header className="page-heading"><div><p className="eyebrow">UTVIKLING OG MØNSTRE</p><h1>Analyse</h1><p className="muted">Se hva som har endret seg, basert på transaksjonene du har registrert.</p></div></header>
      <section className="summary-grid" aria-label="Nøkkeltall denne måneden">
        <article className="summary-card"><span className="summary-label">Inntekter denne måneden</span><strong className="summary-value positive">{formatNok(income)}</strong><span className="summary-note">Registrerte inntekter</span></article>
        <article className="summary-card"><span className="summary-label">Utgifter denne måneden</span><strong className="summary-value">{formatNok(expenses)}</strong><span className="summary-note">Registrerte utgifter</span></article>
        <article className="summary-card"><span className="summary-label">Netto denne måneden</span><strong className={`summary-value ${savings >= 0 ? 'positive' : 'negative'}`}>{formatNok(savings)}</strong><span className="summary-note">Inntekter minus utgifter, ikke banksaldo</span></article>
      </section>
      <section className="card panel">
        <div className="panel-heading"><div><h2>Inntekter og utgifter</h2><p className="muted">Seks siste kalendermåneder · registrerte beløp</p></div><div className="chart-legend"><span><i className="legend-dot income-dot" />Inntekter</span><span><i className="legend-dot expense-dot" />Utgifter</span></div></div>
        {transactions.length ? <div className="monthly-chart analytics-chart" role="img" aria-label="Sammenligning av inntekter og utgifter per måned">
          {months.map((month) => <div className="month-column" key={month.key}><div className="bar-pair">
            <div className="bar-track" title={`Inntekter: ${formatNok(month.income)}`}><div className="chart-bar income-bar" style={{ height: max ? `${month.income / max * 100}%` : '0%' }} /></div>
            <div className="bar-track" title={`Utgifter: ${formatNok(month.expenses)}`}><div className="chart-bar expense-bar" style={{ height: max ? `${month.expenses / max * 100}%` : '0%' }} /></div>
          </div><span className="month-label">{month.label}</span><span className="small analytics-month-values">{formatNok(month.income)} / {formatNok(month.expenses)}</span></div>)}
        </div> : <p className="empty-state">Registrer transaksjoner for å bygge en utvikling over tid.</p>}
        {firstPopulated && lastPopulated && firstPopulated.key !== lastPopulated.key && <p className="insight-note">I perioden viser grafen registreringer fra {firstPopulated.label} til {lastPopulated.label}. Sammenlign hele måneder for å forstå utviklingen.</p>}
      </section>
      <section className="card panel">
        <div className="panel-heading"><div><h2>Kategorier denne måneden</h2><p className="muted">Andel av registrerte utgifter</p></div></div>
        {rankedCategories.length ? <div className="category-list">{rankedCategories.map(([name, amount]) => <div className="category-item" key={name}><div className="category-heading"><span>{name}</span><strong>{formatNok(amount)}</strong></div><div className="category-track" role="img" aria-label={`${name}: ${expenses ? Math.round(amount / expenses * 100) : 0} prosent`}><div className="category-fill" style={{ width: `${expenses ? amount / expenses * 100 : 0}%` }} /></div></div>)}</div> : <p className="empty-state">Ingen kategoridata for denne måneden ennå.</p>}
      </section>
      <p className="disclaimer">Netto er beregnet fra registrerte inntekter og utgifter. Det er ikke en kontosaldo eller prognose.</p>
    </div>
  )
}
