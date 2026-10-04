import './globals.css'
import React from 'react'

export const metadata = {
  title: 'PengePilot',
  description: 'En enkel personlig økonomi-app — Oversikt og transaksjoner'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body>
        <main className="app">
          <div className="top">
            <div className="logo">PengePilot</div>
            <div className="small">V2 • migration/nextjs-prisma-scaffold</div>
          </div>
          <nav className="nav">
            <a href="/">Oversikt</a>
            <a href="/transactions">Transaksjoner</a>
          </nav>
          {children}
        </main>
      </body>
    </html>
  )
}
