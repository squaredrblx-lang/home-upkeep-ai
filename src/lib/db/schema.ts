import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Helper for timestamps
const timestamps = {
  createdAt: text("created_at").default(sql`(datetime('now'))`).notNull(),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`).notNull(),
};

// ─── Users ───────────────────────────────────────────────────────────
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role", { enum: ["owner", "manager", "tenant", "contractor"] }).default("owner").notNull(),
  avatarUrl: text("avatar_url"),
  phone: text("phone"),
  ...timestamps,
});

// ─── Properties ──────────────────────────────────────────────────────
export const properties = sqliteTable("properties", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zip: text("zip").notNull(),
  propertyType: text("property_type", { enum: ["single_family", "duplex", "triplex", "apartment", "commercial", "condo"] }).notNull(),
  yearBuilt: integer("year_built"),
  sqft: integer("sqft"),
  unitsCount: integer("units_count").default(1).notNull(),
  purchaseDate: text("purchase_date"),
  purchasePrice: real("purchase_price"),
  currentValue: real("current_value"),
  imageUrl: text("image_url"),
  notes: text("notes"),
  healthScore: integer("health_score").default(100),
  ...timestamps,
});

// ─── Units ───────────────────────────────────────────────────────────
export const units = sqliteTable("units", {
  id: text("id").primaryKey(),
  propertyId: text("property_id").notNull().references(() => properties.id),
  name: text("name").notNull(), // "Unit A", "Apt 201", "Main Floor"
  floor: integer("floor"),
  bedrooms: integer("bedrooms"),
  bathrooms: real("bathrooms"),
  sqft: integer("sqft"),
  monthlyRent: real("monthly_rent"),
  isOccupied: integer("is_occupied", { mode: "boolean" }).default(false),
  ...timestamps,
});

// ─── Systems ─────────────────────────────────────────────────────────
export const systems = sqliteTable("systems", {
  id: text("id").primaryKey(),
  propertyId: text("property_id").notNull().references(() => properties.id),
  unitId: text("unit_id").references(() => units.id),
  category: text("category", {
    enum: ["hvac", "plumbing", "electrical", "roof", "foundation", "windows", "doors", "insulation", "fire_safety", "elevator", "appliance", "exterior", "interior"],
  }).notNull(),
  name: text("name").notNull(), // "Central AC", "Water Heater", "Main Electrical Panel"
  make: text("make"),
  model: text("model"),
  serialNumber: text("serial_number"),
  installDate: text("install_date"),
  expectedLifespanYears: integer("expected_lifespan_years"),
  warrantyExpiration: text("warranty_expiration"),
  condition: text("condition", { enum: ["excellent", "good", "fair", "poor", "critical"] }).default("good"),
  lastServiceDate: text("last_service_date"),
  notes: text("notes"),
  riskScore: integer("risk_score").default(0), // 0-100
  ...timestamps,
});

// ─── Work Orders ─────────────────────────────────────────────────────
export const workOrders = sqliteTable("work_orders", {
  id: text("id").primaryKey(),
  propertyId: text("property_id").notNull().references(() => properties.id),
  unitId: text("unit_id").references(() => units.id),
  systemId: text("system_id").references(() => systems.id),
  contractorId: text("contractor_id").references(() => contractors.id),
  tenantId: text("tenant_id").references(() => tenants.id),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status", {
    enum: ["open", "assigned", "in_progress", "awaiting_parts", "completed", "cancelled"],
  }).default("open").notNull(),
  priority: text("priority", { enum: ["low", "medium", "high", "emergency"] }).default("medium").notNull(),
  category: text("category", { enum: ["repair", "replacement", "preventive", "inspection", "cosmetic", "emergency"] }).default("repair"),
  estimatedCost: real("estimated_cost"),
  actualCost: real("actual_cost"),
  scheduledDate: text("scheduled_date"),
  completedDate: text("completed_date"),
  dueDate: text("due_date"),
  notes: text("notes"),
  ...timestamps,
});

// ─── Work Order Photos ───────────────────────────────────────────────
export const workOrderPhotos = sqliteTable("work_order_photos", {
  id: text("id").primaryKey(),
  workOrderId: text("work_order_id").notNull().references(() => workOrders.id),
  url: text("url").notNull(),
  caption: text("caption"),
  photoType: text("photo_type", { enum: ["before", "during", "after", "issue"] }).default("issue"),
  ...timestamps,
});

// ─── Contractors ─────────────────────────────────────────────────────
export const contractors = sqliteTable("contractors", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  companyName: text("company_name").notNull(),
  contactName: text("contact_name"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  specialty: text("specialty"), // primary specialty
  rating: real("rating").default(0),
  jobsCompleted: integer("jobs_completed").default(0),
  licenseNumber: text("license_number"),
  insuranceExpiry: text("insurance_expiry"),
  notes: text("notes"),
  isPreferred: integer("is_preferred", { mode: "boolean" }).default(false),
  ...timestamps,
});

// ─── Expenses ────────────────────────────────────────────────────────
export const expenses = sqliteTable("expenses", {
  id: text("id").primaryKey(),
  propertyId: text("property_id").notNull().references(() => properties.id),
  unitId: text("unit_id").references(() => units.id),
  workOrderId: text("work_order_id").references(() => workOrders.id),
  contractorId: text("contractor_id").references(() => contractors.id),
  category: text("category", {
    enum: ["repair", "replacement", "preventive", "inspection", "cosmetic", "utilities", "insurance", "tax", "mortgage", "management", "other"],
  }).notNull(),
  description: text("description").notNull(),
  amount: real("amount").notNull(),
  date: text("date").notNull(),
  isDeductible: integer("is_deductible", { mode: "boolean" }).default(true),
  receiptUrl: text("receipt_url"),
  vendor: text("vendor"),
  paymentMethod: text("payment_method"),
  notes: text("notes"),
  ...timestamps,
});

// ─── Documents ───────────────────────────────────────────────────────
export const documents = sqliteTable("documents", {
  id: text("id").primaryKey(),
  propertyId: text("property_id").references(() => properties.id),
  userId: text("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type"), // pdf, jpg, png, etc.
  fileSize: integer("file_size"),
  category: text("category", {
    enum: ["warranty", "manual", "invoice", "permit", "lease", "inspection_report", "insurance", "tax", "contract", "photo", "other"],
  }).default("other"),
  expirationDate: text("expiration_date"),
  notes: text("notes"),
  ...timestamps,
});

// ─── Tenants ─────────────────────────────────────────────────────────
export const tenants = sqliteTable("tenants", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id), // if they have a login
  propertyId: text("property_id").notNull().references(() => properties.id),
  unitId: text("unit_id").references(() => units.id),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  leaseStart: text("lease_start"),
  leaseEnd: text("lease_end"),
  monthlyRent: real("monthly_rent"),
  depositAmount: real("deposit_amount"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  emergencyContact: text("emergency_contact"),
  notes: text("notes"),
  ...timestamps,
});

// ─── Maintenance Schedules ───────────────────────────────────────────
export const maintenanceSchedules = sqliteTable("maintenance_schedules", {
  id: text("id").primaryKey(),
  propertyId: text("property_id").notNull().references(() => properties.id),
  systemId: text("system_id").references(() => systems.id),
  title: text("title").notNull(),
  description: text("description"),
  frequencyDays: integer("frequency_days").notNull(), // e.g., 90 for quarterly
  lastCompleted: text("last_completed"),
  nextDue: text("next_due"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  season: text("season", { enum: ["spring", "summer", "fall", "winter", "any"] }).default("any"),
  ...timestamps,
});

// ─── Inspections ─────────────────────────────────────────────────────
export const inspections = sqliteTable("inspections", {
  id: text("id").primaryKey(),
  propertyId: text("property_id").notNull().references(() => properties.id),
  unitId: text("unit_id").references(() => units.id),
  inspectorName: text("inspector_name"),
  inspectionType: text("inspection_type", {
    enum: ["annual", "move_in", "move_out", "routine", "emergency", "pre_purchase"],
  }).notNull(),
  date: text("date").notNull(),
  overallCondition: text("overall_condition", { enum: ["excellent", "good", "fair", "poor", "critical"] }),
  reportUrl: text("report_url"),
  notes: text("notes"),
  ...timestamps,
});

// ─── Inspection Items ────────────────────────────────────────────────
export const inspectionItems = sqliteTable("inspection_items", {
  id: text("id").primaryKey(),
  inspectionId: text("inspection_id").notNull().references(() => inspections.id),
  systemId: text("system_id").references(() => systems.id),
  area: text("area"), // "Kitchen", "Basement", "Exterior"
  finding: text("finding").notNull(),
  severity: text("severity", { enum: ["info", "minor", "moderate", "major", "critical"] }).notNull(),
  recommendation: text("recommendation"),
  photoUrl: text("photo_url"),
  resolved: integer("resolved", { mode: "boolean" }).default(false),
  ...timestamps,
});

// ─── Notifications ───────────────────────────────────────────────────
export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type", { enum: ["info", "warning", "alert", "success"] }).default("info"),
  relatedType: text("related_type"), // "work_order", "property", "system"
  relatedId: text("related_id"),
  isRead: integer("is_read", { mode: "boolean" }).default(false),
  ...timestamps,
});

// ─── Audit Log ───────────────────────────────────────────────────────
export const auditLog = sqliteTable("audit_log", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  action: text("action").notNull(), // "created", "updated", "deleted"
  entityType: text("entity_type").notNull(), // "property", "work_order", etc.
  entityId: text("entity_id").notNull(),
  details: text("details"), // JSON string of changes
  ipAddress: text("ip_address"),
  ...timestamps,
});

// ─── Tags ────────────────────────────────────────────────────────────
export const tags = sqliteTable("tags", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  color: text("color").default("#6366f1"),
  ...timestamps,
});

export const tagAssignments = sqliteTable("tag_assignments", {
  id: text("id").primaryKey(),
  tagId: text("tag_id").notNull().references(() => tags.id),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  ...timestamps,
});
