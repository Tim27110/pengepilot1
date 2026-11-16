'use client'

import React from 'react'

const sections = [
  { href: '/settings/general', title: 'Generelt', description: 'Språk, valuta og generelle preferanser.' },
  { href: '/settings/budget', title: 'Budsjett og sparing', description: 'Budsjettpreferanser og sparevalg.' },
  { href: '/settings/notifications', title: 'Varsler', description: 'Økonomiske varsler og påminnelser.' },
  { href: '/settings/privacy', title: 'Personvern og sikkerhet', description: 'Personvern, sikkerhet og databehandling.' },
  { href: '/settings/data', title: 'Data og konto', description: 'Eksport og håndtering av økonomidata.' },
  { href: '/settings/bank', title: 'Banktilkoblinger', description: 'Bankstatus og fremtidige tilkoblinger.' },
  { href: '/settings/about', title: 'Om PengePilot', description: 'Produktinformasjon og versjon.' },
]

export default function SettingsPage() {
  return (
    <div className="product-page">
      <header className="page-heading">
        <div><p className="eyebrow">PREFERANSER</p><h1>Innstillinger</h1><p className="muted">Velg et område for å se relevante valg og informasjon.</p></div>
      </header>
      <div className="settings-grid">
        {sections.map((section) => (
          <a className="card settings-card" href={section.href} key={section.href}>
            <span className="settings-card-mark" aria-hidden="true">›</span>
            <h2>{section.title}</h2><p className="muted">{section.description}</p>
          </a>
        ))}
      </div>
      <p className="disclaimer">Innstillinger som krever lagring blir aktivert etter hvert som tilhørende funksjoner bygges.</p>
    </div>
  )
}
