import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:local.db",
});

export const db = drizzle(client, { schema });

let initialized = false;

export async function initializeDatabase() {
  if (initialized) return;
  initialized = true;

  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'owner',
      avatar_url TEXT,
      phone TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      zip TEXT NOT NULL,
      property_type TEXT NOT NULL,
      year_built INTEGER,
      sqft INTEGER,
      units_count INTEGER NOT NULL DEFAULT 1,
      purchase_date TEXT,
      purchase_price REAL,
      current_value REAL,
      image_url TEXT,
      notes TEXT,
      health_score INTEGER DEFAULT 100,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS units (
      id TEXT PRIMARY KEY,
      property_id TEXT NOT NULL REFERENCES properties(id),
      name TEXT NOT NULL,
      floor INTEGER,
      bedrooms INTEGER,
      bathrooms REAL,
      sqft INTEGER,
      monthly_rent REAL,
      is_occupied INTEGER DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS systems (
      id TEXT PRIMARY KEY,
      property_id TEXT NOT NULL REFERENCES properties(id),
      unit_id TEXT REFERENCES units(id),
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      make TEXT,
      model TEXT,
      serial_number TEXT,
      install_date TEXT,
      expected_lifespan_years INTEGER,
      warranty_expiration TEXT,
      condition TEXT DEFAULT 'good',
      last_service_date TEXT,
      notes TEXT,
      risk_score INTEGER DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contractors (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      company_name TEXT NOT NULL,
      contact_name TEXT,
      email TEXT,
      phone TEXT,
      address TEXT,
      specialty TEXT,
      rating REAL DEFAULT 0,
      jobs_completed INTEGER DEFAULT 0,
      license_number TEXT,
      insurance_expiry TEXT,
      notes TEXT,
      is_preferred INTEGER DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tenants (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      property_id TEXT NOT NULL REFERENCES properties(id),
      unit_id TEXT REFERENCES units(id),
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      lease_start TEXT,
      lease_end TEXT,
      monthly_rent REAL,
      deposit_amount REAL,
      is_active INTEGER DEFAULT 1,
      emergency_contact TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS work_orders (
      id TEXT PRIMARY KEY,
      property_id TEXT NOT NULL REFERENCES properties(id),
      unit_id TEXT REFERENCES units(id),
      system_id TEXT REFERENCES systems(id),
      contractor_id TEXT REFERENCES contractors(id),
      tenant_id TEXT REFERENCES tenants(id),
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'open',
      priority TEXT NOT NULL DEFAULT 'medium',
      category TEXT DEFAULT 'repair',
      estimated_cost REAL,
      actual_cost REAL,
      scheduled_date TEXT,
      completed_date TEXT,
      due_date TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS work_order_photos (
      id TEXT PRIMARY KEY,
      work_order_id TEXT NOT NULL REFERENCES work_orders(id),
      url TEXT NOT NULL,
      caption TEXT,
      photo_type TEXT DEFAULT 'issue',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      property_id TEXT NOT NULL REFERENCES properties(id),
      unit_id TEXT REFERENCES units(id),
      work_order_id TEXT REFERENCES work_orders(id),
      contractor_id TEXT REFERENCES contractors(id),
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      is_deductible INTEGER DEFAULT 1,
      receipt_url TEXT,
      vendor TEXT,
      payment_method TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      property_id TEXT REFERENCES properties(id),
      user_id TEXT NOT NULL REFERENCES users(id),
      name TEXT NOT NULL,
      file_url TEXT NOT NULL,
      file_type TEXT,
      file_size INTEGER,
      category TEXT DEFAULT 'other',
      expiration_date TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS maintenance_schedules (
      id TEXT PRIMARY KEY,
      property_id TEXT NOT NULL REFERENCES properties(id),
      system_id TEXT REFERENCES systems(id),
      title TEXT NOT NULL,
      description TEXT,
      frequency_days INTEGER NOT NULL,
      last_completed TEXT,
      next_due TEXT,
      is_active INTEGER DEFAULT 1,
      season TEXT DEFAULT 'any',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS inspections (
      id TEXT PRIMARY KEY,
      property_id TEXT NOT NULL REFERENCES properties(id),
      unit_id TEXT REFERENCES units(id),
      inspector_name TEXT,
      inspection_type TEXT NOT NULL,
      date TEXT NOT NULL,
      overall_condition TEXT,
      report_url TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS inspection_items (
      id TEXT PRIMARY KEY,
      inspection_id TEXT NOT NULL REFERENCES inspections(id),
      system_id TEXT REFERENCES systems(id),
      area TEXT,
      finding TEXT NOT NULL,
      severity TEXT NOT NULL,
      recommendation TEXT,
      photo_url TEXT,
      resolved INTEGER DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'info',
      related_type TEXT,
      related_id TEXT,
      is_read INTEGER DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS audit_log (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      details TEXT,
      ip_address TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      name TEXT NOT NULL,
      color TEXT DEFAULT '#6366f1',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tag_assignments (
      id TEXT PRIMARY KEY,
      tag_id TEXT NOT NULL REFERENCES tags(id),
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}
