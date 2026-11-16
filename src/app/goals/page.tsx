import React from 'react'
import { formatNok } from '../../lib/finance'

export default function GoalsPage() {
  return (
    <div className="product-page">
      <header className="page-heading"><div><p className="eyebrow">SPARING</p><h1>Mål</h1><p className="muted">Gjør sparing konkret med målbeløp, fremdrift og en tidsramme.</p></div></header>
      <section className="card goal-empty-panel">
        <span className="section-mark" aria-hidden="true">◎</span>
        <h2>Målene dine blir samlet her</h2>
        <p className="muted">Det finnes ingen måldatamodell eller lagrede sparemål i denne versjonen. Vi viser derfor ikke eksempelbeløp som om de var dine.</p>
        <div className="goal-preview-grid" aria-label="Informasjon som vises for hvert sparemål">
          <div><span className="summary-label">Målbeløp</span><strong>—</strong></div>
          <div><span className="summary-label">Spart til nå</span><strong>—</strong></div>
          <div><span className="summary-label">Gjenstår</span><strong>—</strong></div>
          <div><span className="summary-label">Fremdrift</span><strong>—</strong></div>
        </div>
        <p className="small">Eksempelberegning: sparer du {formatNok(100000)} på 12 måneder, tilsvarer det omtrent {formatNok(Math.round(100000 / 12))} per måned. Dette er kun en illustrasjon, ikke et lagret mål.</p>
      </section>
      <section className="content-grid goal-information-grid">
        <article className="card panel"><h2>Fremtidig måloversikt</h2><p className="muted">Mål kan senere vise nåværende beløp, manglende beløp, progresjon og forventet dato basert på faktisk sparetempo.</p></article>
        <article className="card panel"><h2>Hva må bygges</h2><p className="muted">Lagring for mål og innbetalinger må etableres før mål kan opprettes og følges over tid.</p></article>
      </section>
    </div>
  )
}
