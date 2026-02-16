import { type ClassValue } from "clsx";
import { v4 as uuidv4 } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(" ");
}

export function generateId(): string {
  return uuidv4();
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function daysUntil(date: string): number {
  const target = new Date(date);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getHealthColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  if (score >= 40) return "text-orange-600";
  return "text-red-600";
}

export function getHealthBg(score: number): string {
  if (score >= 80) return "bg-green-100";
  if (score >= 60) return "bg-yellow-100";
  if (score >= 40) return "bg-orange-100";
  return "bg-red-100";
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "emergency": return "text-red-700 bg-red-100";
    case "high": return "text-orange-700 bg-orange-100";
    case "medium": return "text-yellow-700 bg-yellow-100";
    case "low": return "text-green-700 bg-green-100";
    default: return "text-gray-700 bg-gray-100";
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "open": return "text-blue-700 bg-blue-100";
    case "assigned": return "text-purple-700 bg-purple-100";
    case "in_progress": return "text-yellow-700 bg-yellow-100";
    case "awaiting_parts": return "text-orange-700 bg-orange-100";
    case "completed": return "text-green-700 bg-green-100";
    case "cancelled": return "text-gray-700 bg-gray-100";
    default: return "text-gray-700 bg-gray-100";
  }
}

export function getConditionColor(condition: string): string {
  switch (condition) {
    case "excellent": return "text-green-700 bg-green-100";
    case "good": return "text-blue-700 bg-blue-100";
    case "fair": return "text-yellow-700 bg-yellow-100";
    case "poor": return "text-orange-700 bg-orange-100";
    case "critical": return "text-red-700 bg-red-100";
    default: return "text-gray-700 bg-gray-100";
  }
}

export function calculateAge(installDate: string): number {
  const now = new Date();
  const install = new Date(installDate);
  return Math.floor((now.getTime() - install.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
}

export function getRemainingLife(installDate: string, lifespanYears: number): { years: number; percentage: number } {
  const age = calculateAge(installDate);
  const remaining = Math.max(0, lifespanYears - age);
  const percentage = Math.max(0, Math.min(100, (remaining / lifespanYears) * 100));
  return { years: remaining, percentage };
}
