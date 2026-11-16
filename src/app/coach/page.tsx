import React from 'react'
import { formatNok } from '../../lib/finance'
import { getFinancialTransactions, monthTransactions, sumType } from '../../lib/financial-summary'

export const dynamic = 'force-dynamic'

export default async function CoachPage() {
  const transactions = await getFinancialTransactions()
  const current = monthTransactions(transactions)
  const income = sumType(current, 'income')
  const expenses = sumType(current, 'expense')
  const categoryTotals = new Map<string, number>()
  for (const transaction of current) if (transaction.type === 'expense') categoryTotals.set(transaction.category, (categoryTotals.get(transaction.category) ?? 0) + transaction.amount)
  const topCategory = Array.from(categoryTotals.entries()).sort((a, b) => b[1] - a[1])[0]

  return (
    <div className="product-page narrow-page">
      <header className="page-heading"><div><p className="eyebrow">REGELBASERT VEILEDNING</p><h1>PengePilot Coach</h1><p className="muted">Forklarbare observasjoner fra registrerte tall. Ingen ekstern AI bruker økonomidataene dine.</p></div></header>
      <section className="card coach-intro"><span className="section-mark" aria-hidden="true">↗</span><h2>Start med det tallene faktisk viser</h2><p className="muted">Coach er foreløpig en veiledningsflate, ikke en chat. Observasjonene nedenfor beregnes fra transaksjoner i inneværende kalendermåned.</p></section>
      <section className="card panel"><div className="panel-heading"><div><h2>Månedens status</h2><p className="muted">Registrert så langt</p></div></div>
        {!current.length ? <p className="empty-state">Det er ikke registrert transaksjoner denne måneden. Legg inn noen transaksjoner for å få relevante observasjoner.</p> : <div className="coach-observations">
          {income > 0 && <article className="coach-observation"><span className="observation-label">Inntekt</span><p>Du har registrert {formatNok(income)} i inntekter denne måneden.</p></article>}
          {expenses > 0 && <article className="coach-observation"><span className="observation-label">Utgifter</span><p>Du har registrert {formatNok(expenses)} i utgifter denne måneden.</p></article>}
          {income > 0 && <article className="coach-observation"><span className="observation-label">Differanse</span><p>{income >= expenses ? `Registrert inntekt overstiger utgiftene med ${formatNok(income - expenses)} så langt.` : `Registrerte utgifter overstiger inntektene med ${formatNok(expenses - income)} så langt.`} Dette er ikke nødvendigvis hele månedens økonomi.</p></article>}
          {topCategory && <article className="coach-observation"><span className="observation-label">Største utgiftskategori</span><p>{topCategory[0]} er den største registrerte kategorien med {formatNok(topCategory[1])}. Sammenlign med en hel måned før du trekker konklusjoner.</p></article>}
          {!income && <p className="insight-note">Det finnes ingen inntektsregistrering denne måneden, så coachen beregner ikke en netto differanse.</p>}
        </div>}
      </section>
      <p className="disclaimer">Dette er enkle, regelbaserte observasjoner – ikke personlig finansrådgivning. Mer avanserte råd krever tilstrekkelig historikk og tydelig forklaring av beregningsgrunnlaget.</p>
    </div>
  )
}
