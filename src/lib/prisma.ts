// Re-export the Prisma 8 ORM client from the generated db module
// This provides a typed database client using the contract system
export { db as prisma, contract } from '@/prisma/db'

// For backwards compatibility, also export as default
export { db as default } from '@/prisma/db'
