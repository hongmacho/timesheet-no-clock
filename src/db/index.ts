import 'server-only'

import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from './schema'
import path from 'path'

const getDb = () => {
  const dbPath = process.env.DATABASE_URL?.replace('file:', '') || './data/app.db'
  const absolutePath = path.resolve(dbPath)
  const sqlite = new Database(absolutePath)
  sqlite.pragma('journal_mode = WAL')
  return drizzle(sqlite, { schema })
}

export type Database = ReturnType<typeof getDb>

let db: Database | undefined

export function getDatabase(): Database {
  if (!db) {
    db = getDb()
  }
  return db
}
