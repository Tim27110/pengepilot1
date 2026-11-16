import React from 'react'
import { notFound } from 'next/navigation'

const sections: Record<string, { title: string; description: string; status: string }> = {
  general: { title: 'Generelt', description: 'Språk, valuta og generelle preferanser for PengePilot.', status: 'Språk og valuta følger foreløpig appens norske standard. Egne valg kan lagres når brukerinnstillinger er etablert.' },
  budget: { title: 'Budsjett og sparing', description: 'Preferanser for budsjetter og sparemål.', status: 'Budsjett- og målinnstillinger blir tilgjengelige når appen får lagring for disse funksjonene.' },
  notifications: { title: 'Varsler', description: 'Økonomiske varsler og påminnelser.', status: 'Varsler er ikke aktivert ennå. PengePilot sender ingen varsler i denne fasen.' },
  privacy: { title: 'Personvern og sikkerhet', description: 'Personvern, sikkerhet og hvordan data behandles.', status: 'Transaksjoner behandles av appens eksisterende server- og databaseoppsett. Ingen eksterne AI- eller banktjenester er koblet til her.' },
  data: { title: 'Data og konto', description: 'Eksport og håndtering av økonomidata.', status: 'Eksport og kontofunksjoner er ikke del av denne fasen. Ikke legg inn bankopplysninger eller secrets i appen.' },
  bank: { title: 'Banktilkoblinger', description: 'Bankstatus og fremtidige tilkoblinger.', status: 'Ingen bank er tilkoblet. Ekte Open Banking er ikke implementert.' },
  about: { title: 'Om PengePilot', description: 'Produktinformasjon og versjon.', status: 'PengePilot bygges videre på Next.js, Prisma og PostgreSQL. Denne versjonen bruker manuelle transaksjonsregistreringer.' },
}

export default function SettingsSectionPage({ params }: { params: { section: string } }) {
  const section = sections[params.section]
  if (!section) notFound()
  return (
    <div className="product-page narrow-page">
      <a className="text-link back-link" href="/settings">← Alle innstillinger</a>
      <header className="page-heading"><div><p className="eyebrow">INNSTILLINGER</p><h1>{section.title}</h1><p className="muted">{section.description}</p></div></header>
      <section className="card panel status-panel"><h2>Status</h2><p>{section.status}</p></section>
    </div>
  )
}
