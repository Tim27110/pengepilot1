import './globals.css'
import React from 'react'

export const metadata = {
  title: 'PengePilot',
  description: 'En enkel personlig økonomi-app for oversikt, transaksjoner og analyse.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body>
        <main className="app">
          <header className="top">
            <a className="logo" href="/">PengePilot</a>
            <span className="small header-note">Personlig økonomi</span>
          </header>
          <nav className="nav" aria-label="Hovedmeny">
            <a href="/">Oversikt</a>
            <a href="/transactions">Transaksjoner</a>
          </nav>
          {children}
          <footer className="app-footer">Oversikten bygger kun på transaksjoner du selv har registrert.</footer>
        </main>
      </body>
    </html>
  )
}
