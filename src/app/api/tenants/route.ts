import { NextRequest, NextResponse } from "next/server";
import { db, initializeDatabase } from "@/lib/db";
import { tenants, properties, units } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { tenantSchema } from "@/lib/validators";
import { generateId } from "@/lib/utils";
import { eq, and, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    initializeDatabase();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const propertyId = req.nextUrl.searchParams.get("propertyId");

    const userProps = db.select({ id: properties.id }).from(properties).where(eq(properties.userId, session.userId)).all();
    const propIds = userProps.map(p => p.id);

    let allTenants = db.select().from(tenants).orderBy(desc(tenants.createdAt)).all().filter(t => propIds.includes(t.propertyId));

    if (propertyId) {
      allTenants = allTenants.filter(t => t.propertyId === propertyId);
    }

    const enriched = allTenants.map(t => {
      const prop = db.select().from(properties).where(eq(properties.id, t.propertyId)).get();
      const unit = t.unitId ? db.select().from(units).where(eq(units.id, t.unitId)).get() : null;
      return { ...t, propertyName: prop?.name, unitName: unit?.name };
    });

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("Tenants GET error:", error);
    return NextResponse.json({ error: "Failed to fetch tenants" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    initializeDatabase();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = tenantSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

    const prop = db.select().from(properties).where(and(eq(properties.id, parsed.data.propertyId), eq(properties.userId, session.userId))).get();
    if (!prop) return NextResponse.json({ error: "Property not found" }, { status: 404 });

    const id = generateId();
    db.insert(tenants).values({ id, ...parsed.data }).run();

    const tenant = db.select().from(tenants).where(eq(tenants.id, id)).get();
    return NextResponse.json(tenant, { status: 201 });
  } catch (error) {
    console.error("Tenants POST error:", error);
    return NextResponse.json({ error: "Failed to create tenant" }, { status: 500 });
  }
}
