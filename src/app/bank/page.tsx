import React from 'react'

export default function BankPage() {
  return (
    <div className="product-page narrow-page">
      <header className="page-heading"><div><p className="eyebrow">BANK OG DATATILGANG</p><h1>Bank</h1><p className="muted">En sikker banktilkobling skal kunne legges til uten å forveksles med testdata.</p></div></header>
      <section className="card bank-status-card">
        <span className="status-badge status-neutral">Ingen bank tilkoblet</span>
        <h2>Banktilkobling er ikke aktivert</h2>
        <p className="muted">Denne versjonen har ingen MockBankProvider eller Open Banking-integrasjon konfigurert. Vi viser derfor ikke demotransaksjoner og ber deg aldri oppgi bankpålogging eller BankID her.</p>
      </section>
      <section className="content-grid bank-detail-grid">
        <article className="card panel"><h2>Manuelle transaksjoner</h2><p className="muted">Transaksjoner du registrerer manuelt ligger i appens eksisterende dataløsning og kan brukes i oversikt og analyse.</p><a className="text-link" href="/transactions">Gå til transaksjoner →</a></article>
        <article className="card panel"><h2>Forberedt for senere integrasjon</h2><p className="muted">En fremtidig integrasjon bør bruke en ekstern, sikker Open Banking-leverandør med eksplisitt samtykke. Ingen credentials eller rå bankdata skal legges i repositoryet.</p></article>
      </section>
    </div>
  )
}
