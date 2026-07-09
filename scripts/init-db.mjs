#!/usr/bin/env node

import Database from "better-sqlite3";

const dbPath = process.env.DATABASE_PATH || "./timesheet.db";
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

console.log("🔧 Initializing timesheet database...");

try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      company_name TEXT,
      currency TEXT DEFAULT 'KRW',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      hourly_rate REAL NOT NULL,
      description TEXT,
      tags TEXT,
      status TEXT DEFAULT 'active',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS time_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      project_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      hours REAL NOT NULL,
      notes TEXT,
      source TEXT DEFAULT 'manual',
      deleted INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      project_id INTEGER NOT NULL,
      invoice_number TEXT NOT NULL UNIQUE,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      total_hours REAL,
      total_amount REAL,
      status TEXT DEFAULT 'draft',
      notes TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(project_id) REFERENCES projects(id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS invoice_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      description TEXT,
      hours REAL NOT NULL,
      hourly_rate REAL NOT NULL,
      amount REAL,
      FOREIGN KEY(invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
    )
  `);

  console.log("✅ Database initialized successfully");
} catch (error) {
  console.error("❌ Database initialization failed:", error);
  process.exit(1);
} finally {
  db.close();
}
