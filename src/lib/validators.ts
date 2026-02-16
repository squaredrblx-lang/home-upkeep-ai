import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const propertySchema = z.object({
  name: z.string().min(1, "Property name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(5, "Valid ZIP code required"),
  propertyType: z.enum(["single_family", "duplex", "triplex", "apartment", "commercial", "condo"]),
  yearBuilt: z.number().optional(),
  sqft: z.number().optional(),
  unitsCount: z.number().default(1),
  purchaseDate: z.string().optional(),
  purchasePrice: z.number().optional(),
  currentValue: z.number().optional(),
  notes: z.string().optional(),
});

export const systemSchema = z.object({
  propertyId: z.string().min(1),
  unitId: z.string().optional(),
  category: z.enum(["hvac", "plumbing", "electrical", "roof", "foundation", "windows", "doors", "insulation", "fire_safety", "elevator", "appliance", "exterior", "interior"]),
  name: z.string().min(1, "System name is required"),
  make: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  installDate: z.string().optional(),
  expectedLifespanYears: z.number().optional(),
  warrantyExpiration: z.string().optional(),
  condition: z.enum(["excellent", "good", "fair", "poor", "critical"]).default("good"),
  notes: z.string().optional(),
});

export const workOrderSchema = z.object({
  propertyId: z.string().min(1),
  unitId: z.string().optional(),
  systemId: z.string().optional(),
  contractorId: z.string().optional(),
  tenantId: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "emergency"]).default("medium"),
  category: z.enum(["repair", "replacement", "preventive", "inspection", "cosmetic", "emergency"]).default("repair"),
  estimatedCost: z.number().optional(),
  scheduledDate: z.string().optional(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
});

export const contractorSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  contactName: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  specialty: z.string().optional(),
  licenseNumber: z.string().optional(),
  insuranceExpiry: z.string().optional(),
  notes: z.string().optional(),
  isPreferred: z.boolean().default(false),
});

export const tenantSchema = z.object({
  propertyId: z.string().min(1),
  unitId: z.string().optional(),
  name: z.string().min(1, "Tenant name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  leaseStart: z.string().optional(),
  leaseEnd: z.string().optional(),
  monthlyRent: z.number().optional(),
  depositAmount: z.number().optional(),
  emergencyContact: z.string().optional(),
  notes: z.string().optional(),
});

export const expenseSchema = z.object({
  propertyId: z.string().min(1),
  unitId: z.string().optional(),
  workOrderId: z.string().optional(),
  contractorId: z.string().optional(),
  category: z.enum(["repair", "replacement", "preventive", "inspection", "cosmetic", "utilities", "insurance", "tax", "mortgage", "management", "other"]),
  description: z.string().min(1, "Description is required"),
  amount: z.number().positive("Amount must be positive"),
  date: z.string().min(1, "Date is required"),
  isDeductible: z.boolean().default(true),
  vendor: z.string().optional(),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PropertyInput = z.infer<typeof propertySchema>;
export type SystemInput = z.infer<typeof systemSchema>;
export type WorkOrderInput = z.infer<typeof workOrderSchema>;
export type ContractorInput = z.infer<typeof contractorSchema>;
export type TenantInput = z.infer<typeof tenantSchema>;
export type ExpenseInput = z.infer<typeof expenseSchema>;
