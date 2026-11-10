# PengePilot

Next.js app med Prisma ORM og PostgreSQL for transaksjonslagring.

## Lokal utvikling

1. Opprett en PostgreSQL-database lokalt eller bruk en PostgreSQL-hostet utviklingsdatabase.
2. Kopier `.env.example` til `.env` og sett `DATABASE_URL` til databasens runtime/pool-tilkobling og `DIRECT_URL` til dens direkte tilkobling. Ikke commit `.env` eller legg credentials i kildekoden.
3. Installer avhengigheter og opprett databaseskjemaet:

   ```sh
   npm install
   npx prisma generate
   npx prisma migrate dev
   ```

4. Start appen med `npm run dev`. Valgfri demodata kan legges inn med `npm run prisma:seed`.

`DATABASE_URL` og `DIRECT_URL` må peke til samme PostgreSQL-database. For lokale databaser kan begge normalt bruke samme tilkoblingsstreng.

## Vercel og Prisma Postgres

Opprett/tilknytt en Prisma Postgres-database via Vercel Marketplace, og konfigurer miljøvariablene for Vercel-prosjektet:

- `DATABASE_URL`: Prisma Postgres pooled/runtime-tilkoblingsstreng.
- `DIRECT_URL`: direkte/non-pooled tilkoblingsstreng for migrasjoner.

Bruk verdiene som integrasjonen gir; ikke legg dem i repoet. Kjør `npm run prisma:deploy` mot produksjonsdatabasen før appen tar i bruk nye skjemaendringer. Kommandoen kan kjøres fra et sikkert deploy-/administrasjonsmiljø med begge variablene satt. Ikke kjør produksjonsmigrasjoner i build-steget.

## Databasemodell

`MockTransaction` beholder feltene og typene fra SQLite-utgaven. Beløp lagres som heltall i øre, datoer som PostgreSQL `TIMESTAMP(3)`, og ID-er som Prisma-genererte CUID-er.
