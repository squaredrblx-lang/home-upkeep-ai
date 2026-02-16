import { NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db";
import { seedDatabase } from "@/lib/seed";

export async function POST() {
  try {
    await initializeDatabase();
    await seedDatabase();
    return NextResponse.json({ success: true, message: "Database seeded" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
