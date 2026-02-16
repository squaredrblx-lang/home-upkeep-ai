import { NextRequest, NextResponse } from "next/server";
import { db, initializeDatabase } from "@/lib/db";
import { systems, properties } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { systemSchema } from "@/lib/validators";
import { generateId } from "@/lib/utils";
import { eq, and, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    await initializeDatabase();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const propertyId = req.nextUrl.searchParams.get("propertyId");

    if (propertyId) {
      const prop = await db.select().from(properties).where(and(eq(properties.id, propertyId), eq(properties.userId, session.userId))).get();
      if (!prop) return NextResponse.json({ error: "Property not found" }, { status: 404 });
      return NextResponse.json(await db.select().from(systems).where(eq(systems.propertyId, propertyId)).orderBy(desc(systems.riskScore)).all());
    }

    // Get all systems for user's properties
    const userProps = await db.select({ id: properties.id }).from(properties).where(eq(properties.userId, session.userId)).all();
    const propIds = userProps.map(p => p.id);
    if (propIds.length === 0) return NextResponse.json([]);

    const allSystems = (await db.select().from(systems).all()).filter(s => propIds.includes(s.propertyId));
    return NextResponse.json(allSystems);
  } catch (error) {
    console.error("Systems GET error:", error);
    return NextResponse.json({ error: "Failed to fetch systems" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await initializeDatabase();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = systemSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

    // Verify property ownership
    const prop = await db.select().from(properties).where(and(eq(properties.id, parsed.data.propertyId), eq(properties.userId, session.userId))).get();
    if (!prop) return NextResponse.json({ error: "Property not found" }, { status: 404 });

    const id = generateId();
    await db.insert(systems).values({ id, ...parsed.data }).run();

    const system = await db.select().from(systems).where(eq(systems.id, id)).get();
    return NextResponse.json(system, { status: 201 });
  } catch (error) {
    console.error("Systems POST error:", error);
    return NextResponse.json({ error: "Failed to create system" }, { status: 500 });
  }
}
