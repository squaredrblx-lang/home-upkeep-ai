import { db } from "./db";
import { users, properties, units, systems, workOrders, contractors, tenants, expenses, maintenanceSchedules } from "./db/schema";
import { generateId } from "./utils";
import { hashPassword } from "./auth";

export async function seedDatabase() {
  // Check if already seeded
  const existingUsers = await db.select().from(users).all();
  if (existingUsers.length > 0) return;

  // Demo user
  const userId = generateId();
  await db.insert(users).values({
    id: userId,
    email: "demo@homeupkeep.ai",
    passwordHash: hashPassword("demo1234"),
    name: "Alex Rivera",
    role: "owner",
    phone: "(555) 123-4567",
  }).run();

  // Properties
  const prop1Id = generateId();
  const prop2Id = generateId();
  const prop3Id = generateId();

  await db.insert(properties).values([
    {
      id: prop1Id,
      userId,
      name: "Maple Street Duplex",
      address: "142 Maple Street",
      city: "Springfield",
      state: "IL",
      zip: "62701",
      propertyType: "duplex",
      yearBuilt: 1985,
      sqft: 2400,
      unitsCount: 2,
      purchaseDate: "2019-06-15",
      purchasePrice: 185000,
      currentValue: 245000,
      healthScore: 72,
    },
    {
      id: prop2Id,
      userId,
      name: "Oak Avenue Rental",
      address: "88 Oak Avenue",
      city: "Springfield",
      state: "IL",
      zip: "62704",
      propertyType: "single_family",
      yearBuilt: 1998,
      sqft: 1800,
      unitsCount: 1,
      purchaseDate: "2021-03-01",
      purchasePrice: 220000,
      currentValue: 275000,
      healthScore: 89,
    },
    {
      id: prop3Id,
      userId,
      name: "Downtown Apartments",
      address: "500 Main Street",
      city: "Springfield",
      state: "IL",
      zip: "62702",
      propertyType: "apartment",
      yearBuilt: 1972,
      sqft: 6000,
      unitsCount: 4,
      purchaseDate: "2018-01-20",
      purchasePrice: 420000,
      currentValue: 510000,
      healthScore: 58,
    },
  ]).run();

  // Units
  const unit1a = generateId();
  const unit1b = generateId();
  const unit3a = generateId();
  const unit3b = generateId();
  const unit3c = generateId();
  const unit3d = generateId();

  await db.insert(units).values([
    { id: unit1a, propertyId: prop1Id, name: "Unit A", floor: 1, bedrooms: 2, bathrooms: 1, sqft: 1200, monthlyRent: 1100, isOccupied: true },
    { id: unit1b, propertyId: prop1Id, name: "Unit B", floor: 2, bedrooms: 2, bathrooms: 1, sqft: 1200, monthlyRent: 1150, isOccupied: true },
    { id: unit3a, propertyId: prop3Id, name: "Apt 101", floor: 1, bedrooms: 1, bathrooms: 1, sqft: 700, monthlyRent: 850, isOccupied: true },
    { id: unit3b, propertyId: prop3Id, name: "Apt 102", floor: 1, bedrooms: 2, bathrooms: 1, sqft: 900, monthlyRent: 1050, isOccupied: true },
    { id: unit3c, propertyId: prop3Id, name: "Apt 201", floor: 2, bedrooms: 1, bathrooms: 1, sqft: 700, monthlyRent: 875, isOccupied: false },
    { id: unit3d, propertyId: prop3Id, name: "Apt 202", floor: 2, bedrooms: 2, bathrooms: 1, sqft: 900, monthlyRent: 1075, isOccupied: true },
  ]).run();

  // Systems
  const waterHeaterId = generateId();
  await db.insert(systems).values([
    { id: generateId(), propertyId: prop1Id, category: "hvac", name: "Central Furnace", make: "Carrier", model: "59SC5A", installDate: "2012-11-01", expectedLifespanYears: 20, condition: "fair", lastServiceDate: "2024-10-15", riskScore: 45 },
    { id: generateId(), propertyId: prop1Id, category: "hvac", name: "Central AC", make: "Carrier", model: "24ACC6", installDate: "2012-11-01", expectedLifespanYears: 15, condition: "poor", lastServiceDate: "2024-05-20", riskScore: 72 },
    { id: waterHeaterId, propertyId: prop1Id, category: "plumbing", name: "Water Heater", make: "Rheem", model: "XE50T06ST45U1", installDate: "2014-03-10", expectedLifespanYears: 12, condition: "poor", warrantyExpiration: "2024-03-10", lastServiceDate: "2023-06-01", riskScore: 85 },
    { id: generateId(), propertyId: prop1Id, category: "roof", name: "Asphalt Shingle Roof", installDate: "2005-08-15", expectedLifespanYears: 25, condition: "fair", lastServiceDate: "2024-04-01", riskScore: 55 },
    { id: generateId(), propertyId: prop1Id, category: "electrical", name: "Main Electrical Panel", make: "Square D", installDate: "1985-01-01", expectedLifespanYears: 40, condition: "good", riskScore: 30 },
    { id: generateId(), propertyId: prop1Id, category: "plumbing", name: "Sump Pump", make: "Wayne", model: "CDU980E", installDate: "2020-04-15", expectedLifespanYears: 10, condition: "good", riskScore: 15 },
    { id: generateId(), propertyId: prop2Id, category: "hvac", name: "Heat Pump", make: "Trane", model: "XR15", installDate: "2018-09-01", expectedLifespanYears: 15, condition: "excellent", lastServiceDate: "2025-01-10", riskScore: 8 },
    { id: generateId(), propertyId: prop2Id, category: "plumbing", name: "Tankless Water Heater", make: "Rinnai", model: "RU199iN", installDate: "2021-03-15", expectedLifespanYears: 20, condition: "excellent", warrantyExpiration: "2033-03-15", riskScore: 3 },
    { id: generateId(), propertyId: prop2Id, category: "roof", name: "Metal Roof", installDate: "2015-06-01", expectedLifespanYears: 50, condition: "excellent", riskScore: 2 },
    { id: generateId(), propertyId: prop3Id, category: "hvac", name: "Boiler System", make: "Weil-McLain", installDate: "2008-10-01", expectedLifespanYears: 20, condition: "fair", lastServiceDate: "2024-09-01", riskScore: 60 },
    { id: generateId(), propertyId: prop3Id, category: "plumbing", name: "Main Water Line", installDate: "1972-01-01", expectedLifespanYears: 50, condition: "poor", riskScore: 78 },
    { id: generateId(), propertyId: prop3Id, category: "electrical", name: "Electrical Panel", make: "Federal Pacific", installDate: "1972-01-01", expectedLifespanYears: 40, condition: "critical", riskScore: 95, notes: "Federal Pacific panels are a known fire hazard. Recommend immediate replacement." },
    { id: generateId(), propertyId: prop3Id, category: "fire_safety", name: "Fire Alarm System", installDate: "2015-03-01", expectedLifespanYears: 15, condition: "good", riskScore: 20 },
  ]).run();

  // Contractors
  const cont1 = generateId();
  const cont2 = generateId();
  const cont3 = generateId();

  await db.insert(contractors).values([
    { id: cont1, userId, companyName: "ABC Plumbing & Heating", contactName: "Mike Torres", email: "mike@abcplumbing.com", phone: "(555) 234-5678", specialty: "plumbing", rating: 4.8, jobsCompleted: 12, isPreferred: true },
    { id: cont2, userId, companyName: "Elite Electric", contactName: "Sarah Chen", email: "sarah@eliteelectric.com", phone: "(555) 345-6789", specialty: "electrical", rating: 4.5, jobsCompleted: 5, isPreferred: true },
    { id: cont3, userId, companyName: "Top Notch Roofing", contactName: "James Miller", email: "james@topnotchroofing.com", phone: "(555) 456-7890", specialty: "roofing", rating: 4.2, jobsCompleted: 3, isPreferred: false },
  ]).run();

  // Tenants
  const ten1 = generateId();
  const ten2 = generateId();

  await db.insert(tenants).values([
    { id: ten1, propertyId: prop1Id, unitId: unit1a, name: "Maria Johnson", email: "maria.j@email.com", phone: "(555) 567-8901", leaseStart: "2023-08-01", leaseEnd: "2025-07-31", monthlyRent: 1100, depositAmount: 1100, isActive: true },
    { id: ten2, propertyId: prop1Id, unitId: unit1b, name: "David Kim", email: "david.k@email.com", phone: "(555) 678-9012", leaseStart: "2024-01-01", leaseEnd: "2025-12-31", monthlyRent: 1150, depositAmount: 1150, isActive: true },
    { id: generateId(), propertyId: prop3Id, unitId: unit3a, name: "Lisa Park", email: "lisa.p@email.com", phone: "(555) 789-0123", leaseStart: "2024-06-01", leaseEnd: "2025-05-31", monthlyRent: 850, depositAmount: 850, isActive: true },
    { id: generateId(), propertyId: prop3Id, unitId: unit3b, name: "Tom Wright", email: "tom.w@email.com", phone: "(555) 890-1234", leaseStart: "2023-09-01", leaseEnd: "2025-08-31", monthlyRent: 1050, depositAmount: 1050, isActive: true },
    { id: generateId(), propertyId: prop3Id, unitId: unit3d, name: "Rachel Green", email: "rachel.g@email.com", phone: "(555) 901-2345", leaseStart: "2024-03-01", leaseEnd: "2026-02-28", monthlyRent: 1075, depositAmount: 1075, isActive: true },
  ]).run();

  // Work Orders
  await db.insert(workOrders).values([
    { id: generateId(), propertyId: prop1Id, systemId: waterHeaterId, contractorId: cont1, title: "Water heater making rumbling noises", description: "Tenant in Unit A reports loud rumbling from basement. Water heater is 10+ years old. Sediment buildup likely. May need flush or replacement.", status: "open", priority: "high", category: "repair", estimatedCost: 1200, scheduledDate: "2026-02-20" },
    { id: generateId(), propertyId: prop1Id, unitId: unit1b, tenantId: ten2, title: "Kitchen faucet dripping", description: "Slow drip from kitchen faucet. Washer replacement likely needed.", status: "assigned", priority: "low", category: "repair", contractorId: cont1, estimatedCost: 150, scheduledDate: "2026-02-25" },
    { id: generateId(), propertyId: prop3Id, title: "Electrical panel replacement - URGENT", description: "Federal Pacific panel is a known fire hazard. Multiple inspectors have flagged this. Must be replaced with modern panel.", status: "in_progress", priority: "emergency", category: "replacement", contractorId: cont2, estimatedCost: 4500, scheduledDate: "2026-02-18" },
    { id: generateId(), propertyId: prop2Id, title: "Annual HVAC tune-up", description: "Scheduled preventive maintenance for heat pump system.", status: "completed", priority: "low", category: "preventive", contractorId: cont1, estimatedCost: 200, actualCost: 185, scheduledDate: "2025-01-10", completedDate: "2025-01-10" },
    { id: generateId(), propertyId: prop1Id, title: "Gutter cleaning - Spring", description: "Semi-annual gutter cleaning for all sides of building.", status: "open", priority: "medium", category: "preventive", estimatedCost: 300, dueDate: "2026-04-01" },
  ]).run();

  // Expenses
  await db.insert(expenses).values([
    { id: generateId(), propertyId: prop1Id, category: "repair", description: "Emergency pipe repair - Unit A bathroom", amount: 450, date: "2025-11-15", vendor: "ABC Plumbing", paymentMethod: "check", isDeductible: true },
    { id: generateId(), propertyId: prop1Id, category: "preventive", description: "Furnace annual inspection", amount: 185, date: "2025-10-15", vendor: "ABC Plumbing & Heating", paymentMethod: "credit_card", isDeductible: true },
    { id: generateId(), propertyId: prop2Id, category: "preventive", description: "HVAC tune-up", amount: 185, date: "2025-01-10", vendor: "ABC Plumbing & Heating", paymentMethod: "credit_card", isDeductible: true },
    { id: generateId(), propertyId: prop3Id, category: "repair", description: "Boiler pressure valve replacement", amount: 780, date: "2025-09-22", vendor: "ABC Plumbing & Heating", paymentMethod: "check", isDeductible: true },
    { id: generateId(), propertyId: prop3Id, category: "cosmetic", description: "Apt 201 repaint for new tenant", amount: 1200, date: "2025-08-01", vendor: "Fresh Coat Painting", paymentMethod: "credit_card", isDeductible: true },
    { id: generateId(), propertyId: prop1Id, category: "insurance", description: "Annual property insurance premium", amount: 2400, date: "2025-01-01", vendor: "State Farm", paymentMethod: "bank_transfer", isDeductible: true },
    { id: generateId(), propertyId: prop2Id, category: "insurance", description: "Annual property insurance premium", amount: 1800, date: "2025-01-01", vendor: "State Farm", paymentMethod: "bank_transfer", isDeductible: true },
    { id: generateId(), propertyId: prop3Id, category: "insurance", description: "Annual property insurance premium", amount: 4200, date: "2025-01-01", vendor: "State Farm", paymentMethod: "bank_transfer", isDeductible: true },
  ]).run();

  // Maintenance Schedules
  await db.insert(maintenanceSchedules).values([
    { id: generateId(), propertyId: prop1Id, title: "HVAC Filter Change", description: "Replace furnace and AC filters", frequencyDays: 90, lastCompleted: "2025-12-01", nextDue: "2026-03-01", season: "any" },
    { id: generateId(), propertyId: prop1Id, title: "Gutter Cleaning", description: "Clean all gutters and downspouts", frequencyDays: 180, lastCompleted: "2025-10-15", nextDue: "2026-04-15", season: "spring" },
    { id: generateId(), propertyId: prop1Id, title: "Smoke Detector Test", description: "Test all smoke and CO detectors, replace batteries", frequencyDays: 180, lastCompleted: "2025-09-01", nextDue: "2026-03-01", season: "any" },
    { id: generateId(), propertyId: prop2Id, title: "HVAC Filter Change", description: "Replace heat pump filter", frequencyDays: 90, lastCompleted: "2026-01-10", nextDue: "2026-04-10", season: "any" },
    { id: generateId(), propertyId: prop3Id, title: "Boiler Inspection", description: "Annual professional boiler inspection", frequencyDays: 365, lastCompleted: "2025-09-01", nextDue: "2026-09-01", season: "fall" },
    { id: generateId(), propertyId: prop3Id, title: "Fire Alarm Testing", description: "Professional fire alarm system testing", frequencyDays: 365, lastCompleted: "2025-03-01", nextDue: "2026-03-01", season: "any" },
  ]).run();

  console.log("Database seeded successfully!");
}
