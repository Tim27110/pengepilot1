import React from 'react'
import prisma from '../lib/prisma'
import { formatNok } from '../lib/finance'
import TransactionList from '../components/TransactionList'

type MonthlyTotals = { income: number; expenses: number }
type ExpenseCategory = { name: string; amount: number }

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function monthLabel(date: Date): string {
  return new Intl.DateTimeFormat('nb-NO', { month: 'short' }).format(date)
}

export default async function Page() {
  const transactions = await prisma.mockTransaction.findMany({
    orderBy: [{ occurredAt: 'desc' }, { createdAt: 'desc' }],
  })
  const now = new Date()
  const currentMonthKey = monthKey(now)
  const currentMonth = transactions.filter((item) => monthKey(item.occurredAt) === currentMonthKey)
  const totalIncome = transactions.reduce((sum, item) => sum + (item.type === 'income' ? item.amount : 0), 0)
  const totalExpenses = transactions.reduce((sum, item) => sum + (item.type === 'expense' ? item.amount : 0), 0)
  const monthIncome = currentMonth.reduce((sum, item) => sum + (item.type === 'income' ? item.amount : 0), 0)
  const monthExpenses = currentMonth.reduce((sum, item) => sum + (item.type === 'expense' ? item.amount : 0), 0)
  const monthlyTotals = new Map<string, MonthlyTotals>()
  const categoryTotals = new Map<string, number>()

  for (const item of transactions) {
    const key = monthKey(item.occurredAt)
    const totals = monthlyTotals.get(key) ?? { income: 0, expenses: 0 }
    if (item.type === 'income') totals.income += item.amount
    if (item.type === 'expense') totals.expenses += item.amount
    monthlyTotals.set(key, totals)
  }

  for (const item of currentMonth) {
    if (item.type === 'expense') {
      categoryTotals.set(item.category, (categoryTotals.get(item.category) ?? 0) + item.amount)
    }
  }

  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
    return { key: monthKey(date), label: monthLabel(date), ...monthlyTotals.get(monthKey(date)) ?? { income: 0, expenses: 0 } }
  })
  const chartMax = Math.max(0, ...months.flatMap((month) => [month.income, month.expenses]))
  const categories: ExpenseCategory[] = Array.from(categoryTotals, ([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
  const largestCategory = categories[0]
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const previousExpenses = monthlyTotals.get(monthKey(previousMonth))?.expenses ?? 0
  const suggestions: string[] = []

  if (monthExpenses > 0 && largestCategory && largestCategory.amount / monthExpenses >= 0.4) {
    suggestions.push(
      `${largestCategory.name} utgjør ${Math.round((largestCategory.amount / monthExpenses) * 100)} % av utgiftene denne måneden (${formatNok(largestCategory.amount)}). Se om noen av kostnadene kan planlegges eller reduseres.`,
    )
  }
  if (previousExpenses > 0 && monthExpenses > previousExpenses * 1.2 && monthExpenses - previousExpenses >= 50000) {
    suggestions.push(
      `Utgiftene er høyere enn forrige måned med ${formatNok(monthExpenses - previousExpenses)}. Gå gjennom de største postene for å se hva som har endret seg.`,
    )
  }

  return (
    <div className="dashboard">
      <div className="page-heading">
        <div>
          <p className="eyebrow">PERSONLIG ØKONOMI</p>
          <h1>Oversikt</h1>
          <p className="muted">Basert på transaksjonene du har registrert.</p>
        </div>
        <a className="button" href="/transactions">Legg til transaksjon</a>
      </div>

      <section className="summary-grid" aria-label="Økonomisk oversikt">
        <article className="summary-card">
          <span className="summary-label">Saldo totalt</span>
          <strong className="summary-value">{formatNok(totalIncome - totalExpenses)}</strong>
          <span className="summary-note">Inntekter minus utgifter, alle registrerte perioder</span>
        </article>
        <article className="summary-card">
          <span className="summary-label">Inntekter denne måneden</span>
          <strong className="summary-value positive">{formatNok(monthIncome)}</strong>
          <span className="summary-note">Totalt registrert: {formatNok(totalIncome)}</span>
        </article>
        <article className="summary-card">
          <span className="summary-label">Utgifter denne måneden</span>
          <strong className="summary-value">{formatNok(monthExpenses)}</strong>
          <span className="summary-note">Totalt registrert: {formatNok(totalExpenses)}</span>
        </article>
        <article className="summary-card">
          <span className="summary-label">Til overs denne måneden</span>
          <strong className={`summary-value ${monthIncome - monthExpenses >= 0 ? 'positive' : 'negative'}`}>
            {formatNok(monthIncome - monthExpenses)}
          </strong>
          <span className="summary-note">Månedsinntekter minus månedsutgifter</span>
        </article>
      </section>

      <section className="content-grid">
        <article className="card panel">
          <div className="panel-heading">
            <div>
              <h2>Månedlig oversikt</h2>
              <p className="muted">Inntekter og utgifter de siste seks månedene</p>
            </div>
            <div className="chart-legend" aria-label="Tegnforklaring">
              <span><i className="legend-dot income-dot" />Inntekter</span>
              <span><i className="legend-dot expense-dot" />Utgifter</span>
            </div>
          </div>
          {transactions.length === 0 ? (
            <p className="empty-state">Registrer en transaksjon for å se månedsoversikten.</p>
          ) : (
            <div className="monthly-chart" role="img" aria-label="Sammenligning av registrerte inntekter og utgifter per måned">
              {months.map((month) => (
                <div className="month-column" key={month.key}>
                  <div className="bar-pair">
                    <div className="bar-track" title={`Inntekter: ${formatNok(month.income)}`}>
                      <div className="chart-bar income-bar" style={{ height: chartMax ? `${(month.income / chartMax) * 100}%` : '0%' }} />
                    </div>
                    <div className="bar-track" title={`Utgifter: ${formatNok(month.expenses)}`}>
                      <div className="chart-bar expense-bar" style={{ height: chartMax ? `${(month.expenses / chartMax) * 100}%` : '0%' }} />
                    </div>
                  </div>
                  <span className="month-label">{month.label}</span>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="card panel">
          <div className="panel-heading">
            <div>
              <h2>Utgifter per kategori</h2>
              <p className="muted">Fordeling denne måneden</p>
            </div>
          </div>
          {categories.length === 0 ? (
            <p className="empty-state">Ingen utgifter registrert denne måneden.</p>
          ) : (
            <div className="category-list">
              {categories.map((category) => (
                <div className="category-item" key={category.name}>
                  <div className="category-heading">
                    <span>{category.name}</span>
                    <strong>{formatNok(category.amount)}</strong>
                  </div>
                  <div className="category-track" aria-label={`${category.name}: ${Math.round((category.amount / monthExpenses) * 100)} prosent`}>
                    <div className="category-fill" style={{ width: `${(category.amount / monthExpenses) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="content-grid lower-grid">
        <article className="card panel">
          <div className="panel-heading">
            <div>
              <h2>Enkle forslag</h2>
              <p className="muted">Regelbaserte observasjoner fra registrerte utgifter</p>
            </div>
          </div>
          {suggestions.length ? (
            <ul className="suggestion-list">
              {suggestions.map((suggestion) => <li key={suggestion}>{suggestion}</li>)}
            </ul>
          ) : (
            <p className="empty-state">Vi har ikke nok registrerte utgifter til å foreslå noe ennå.</p>
          )}
          <p className="disclaimer">Dette er enkle observasjoner, ikke personlig økonomisk rådgivning.</p>
        </article>

        <article className="card panel recent-panel">
          <div className="panel-heading">
            <div>
              <h2>Siste transaksjoner</h2>
              <p className="muted">De nyeste registreringene</p>
            </div>
            <a className="text-link" href="/transactions">Se alle</a>
          </div>
          <TransactionList limit={6} />
        </article>
      </section>
    </div>
  )
}
