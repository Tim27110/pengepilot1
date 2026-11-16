import './globals.css'
import React from 'react'

export const metadata = {
  title: 'PengePilot',
  description: 'En personlig økonomiplattform for oversikt, transaksjoner, budsjett og analyse.',
}

const navigation = [
  { href: '/', label: 'Oversikt' },
  { href: '/transactions', label: 'Transaksjoner' },
  { href: '/budget', label: 'Budsjett' },
  { href: '/goals', label: 'Mål' },
  { href: '/analytics', label: 'Analyse' },
  { href: '/coach', label: 'Coach' },
  { href: '/bank', label: 'Bank' },
  { href: '/settings', label: 'Innstillinger' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body>
        <main className="app">
          <header className="top">
            <a className="logo" href="/">PengePilot<span className="logo-period">.</span></a>
            <span className="small header-note">Personlig økonomi</span>
          </header>
          <nav className="nav" aria-label="Hovedmeny">
            {navigation.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}
          </nav>
          {children}
          <footer className="app-footer">Oversikten bygger på registrerte transaksjoner. Banktilkobling er ikke aktivert.</footer>
        </main>
      </body>
    </html>
  )
}
