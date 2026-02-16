import { NextRequest, NextResponse } from "next/server";
import { db, initializeDatabase } from "@/lib/db";
import { properties, systems, workOrders, units, expenses } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { propertySchema } from "@/lib/validators";
import { generateId } from "@/lib/utils";
import { eq, and, sql, desc } from "drizzle-orm";

export async function GET() {
  try {
    await initializeDatabase();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const props = await db.select().from(properties).where(eq(properties.userId, session.userId)).orderBy(desc(properties.createdAt)).all();

    // Enrich with counts
    const enriched = await Promise.all(props.map(async (p) => {
      const systemCount = await db.select({ count: sql<number>`count(*)` }).from(systems).where(eq(systems.propertyId, p.id)).get();
      const openWorkOrders = await db.select({ count: sql<number>`count(*)` }).from(workOrders).where(and(eq(workOrders.propertyId, p.id), sql`${workOrders.status} != 'completed' AND ${workOrders.status} != 'cancelled'`)).get();
      const unitCount = await db.select({ count: sql<number>`count(*)` }).from(units).where(eq(units.propertyId, p.id)).get();
      const totalExpenses = await db.select({ total: sql<number>`COALESCE(sum(${expenses.amount}), 0)` }).from(expenses).where(eq(expenses.propertyId, p.id)).get();

      return {
        ...p,
        systemCount: systemCount?.count || 0,
        openWorkOrders: openWorkOrders?.count || 0,
        unitCount: unitCount?.count || 0,
        totalExpenses: totalExpenses?.total || 0,
      };
    }));

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("Properties GET error:", error);
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await initializeDatabase();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = propertySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const id = generateId();
    await db.insert(properties).values({
      id,
      userId: session.userId,
      ...parsed.data,
    }).run();

    const property = await db.select().from(properties).where(eq(properties.id, id)).get();
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error("Properties POST error:", error);
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 });
  }
}
