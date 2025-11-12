import Database from 'better-sqlite3'
import { existsSync, mkdirSync } from 'fs'
import { dirname } from 'path'
import { createTables, createTriggers } from './schema'
import { seedDatabase } from './seed'

const DATABASE_PATH = process.env.DATABASE_PATH || './data/ecommerce.db'

let db: Database.Database | null = null

export const getDb = (): Database.Database => {
  if (!db) {
    // Ensure data directory exists
    const dir = dirname(DATABASE_PATH)
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
      console.log(`Created directory: ${dir}`)
    }

    // Check if database file exists
    const isNewDatabase = !existsSync(DATABASE_PATH)

    // Create or open database
    db = new Database(DATABASE_PATH)
    console.log(`Database ${isNewDatabase ? 'created' : 'opened'} at: ${DATABASE_PATH}`)

    // Enable foreign keys
    db.pragma('foreign_keys = ON')

    // Enable WAL mode for better concurrency
    db.pragma('journal_mode = WAL')

    // Create tables if new database
    if (isNewDatabase) {
      console.log('Initializing new database...')

      // Create all tables
      db.exec(createTables)
      console.log('Tables created successfully')

      // Create triggers
      db.exec(createTriggers)
      console.log('Triggers created successfully')

      // Seed initial data
      seedDatabase(db)
    } else {
      // Check if tables exist
      const tableCheck = db.prepare(`
        SELECT name FROM sqlite_master
        WHERE type='table' AND name='products'
      `).get()

      if (!tableCheck) {
        console.log('Tables not found, creating...')
        db.exec(createTables)
        db.exec(createTriggers)
        seedDatabase(db)
      }
    }
  }

  return db
}

// Helper functions for common database operations
export const runQuery = <T>(sql: string, params: any[] = []): T[] => {
  const database = getDb()
  const stmt = database.prepare(sql)
  return stmt.all(...params) as T[]
}

export const runGet = <T>(sql: string, params: any[] = []): T | undefined => {
  const database = getDb()
  const stmt = database.prepare(sql)
  return stmt.get(...params) as T | undefined
}

export const runInsert = (sql: string, params: any[] = []): number => {
  const database = getDb()
  const stmt = database.prepare(sql)
  const result = stmt.run(...params)
  return result.lastInsertRowid as number
}

export const runUpdate = (sql: string, params: any[] = []): number => {
  const database = getDb()
  const stmt = database.prepare(sql)
  const result = stmt.run(...params)
  return result.changes
}

export const runDelete = (sql: string, params: any[] = []): number => {
  const database = getDb()
  const stmt = database.prepare(sql)
  const result = stmt.run(...params)
  return result.changes
}

// Transaction helper
export const runTransaction = <T>(fn: (db: Database.Database) => T): T => {
  const database = getDb()
  return database.transaction(fn)(database)
}

// Close database connection (for cleanup)
export const closeDb = () => {
  if (db) {
    db.close()
    db = null
    console.log('Database connection closed')
  }
}

// Initialize database on module load
if (typeof window === 'undefined') {
  // Only initialize on server-side
  getDb()
}