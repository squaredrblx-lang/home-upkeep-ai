import { NextRequest, NextResponse } from "next/server";
import { db, initializeDatabase } from "@/lib/db";
import { expenses, properties } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { expenseSchema } from "@/lib/validators";
import { generateId } from "@/lib/utils";
import { eq, and, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    initializeDatabase();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const propertyId = req.nextUrl.searchParams.get("propertyId");

    const userProps = db.select({ id: properties.id, name: properties.name }).from(properties).where(eq(properties.userId, session.userId)).all();
    const propMap = new Map(userProps.map(p => [p.id, p.name]));

    let allExpenses = db.select().from(expenses).orderBy(desc(expenses.date)).all().filter(e => propMap.has(e.propertyId));

    if (propertyId) {
      allExpenses = allExpenses.filter(e => e.propertyId === propertyId);
    }

    const enriched = allExpenses.map(e => ({
      ...e,
      propertyName: propMap.get(e.propertyId) || "Unknown",
    }));

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("Expenses GET error:", error);
    return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    initializeDatabase();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = expenseSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

    const prop = db.select().from(properties).where(and(eq(properties.id, parsed.data.propertyId), eq(properties.userId, session.userId))).get();
    if (!prop) return NextResponse.json({ error: "Property not found" }, { status: 404 });

    const id = generateId();
    db.insert(expenses).values({ id, ...parsed.data }).run();

    const expense = db.select().from(expenses).where(eq(expenses.id, id)).get();
    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error("Expenses POST error:", error);
    return NextResponse.json({ error: "Failed to create expense" }, { status: 500 });
  }
}
