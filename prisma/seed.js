// Simple seed script to create demo transactions. Run with `node prisma/seed.js` after generating prisma client
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main(){
  await prisma.mockTransaction.createMany({ data: [
    { description: 'Lønn', amount: 2500000, type: 'income', category: 'Inntekt', occurredAt: new Date('2026-09-01') },
    { description: 'Husleie', amount: 850000, type: 'expense', category: 'Bolig', occurredAt: new Date('2026-09-01') }
  ]})
  console.log('Seed ferdig')
}
main().catch(e=>{ console.error(e); process.exit(1) }).finally(()=>prisma.$disconnect())
