import { NextRequest, NextResponse } from "next/server";
import { db, initializeDatabase } from "@/lib/db";
import { workOrders, properties, contractors, systems } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { workOrderSchema } from "@/lib/validators";
import { generateId } from "@/lib/utils";
import { eq, and, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    await initializeDatabase();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const propertyId = req.nextUrl.searchParams.get("propertyId");
    const status = req.nextUrl.searchParams.get("status");

    const userProps = await db.select({ id: properties.id }).from(properties).where(eq(properties.userId, session.userId)).all();
    const propIds = userProps.map(p => p.id);
    if (propIds.length === 0) return NextResponse.json([]);

    let allOrders = (await db.select().from(workOrders).orderBy(desc(workOrders.createdAt)).all()).filter(wo => propIds.includes(wo.propertyId));

    if (propertyId) {
      allOrders = allOrders.filter(wo => wo.propertyId === propertyId);
    }
    if (status) {
      allOrders = allOrders.filter(wo => wo.status === status);
    }

    // Enrich with property name and contractor name
    const enriched = await Promise.all(allOrders.map(async wo => {
      const prop = await db.select().from(properties).where(eq(properties.id, wo.propertyId)).get();
      const contractor = wo.contractorId ? await db.select().from(contractors).where(eq(contractors.id, wo.contractorId)).get() : null;
      const system = wo.systemId ? await db.select().from(systems).where(eq(systems.id, wo.systemId)).get() : null;

      return {
        ...wo,
        propertyName: prop?.name || "Unknown",
        contractorName: contractor?.companyName || null,
        systemName: system?.name || null,
      };
    }));

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("Work orders GET error:", error);
    return NextResponse.json({ error: "Failed to fetch work orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await initializeDatabase();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = workOrderSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

    const prop = await db.select().from(properties).where(and(eq(properties.id, parsed.data.propertyId), eq(properties.userId, session.userId))).get();
    if (!prop) return NextResponse.json({ error: "Property not found" }, { status: 404 });

    const id = generateId();
    await db.insert(workOrders).values({ id, ...parsed.data }).run();

    const wo = await db.select().from(workOrders).where(eq(workOrders.id, id)).get();
    return NextResponse.json(wo, { status: 201 });
  } catch (error) {
    console.error("Work orders POST error:", error);
    return NextResponse.json({ error: "Failed to create work order" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await initializeDatabase();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: "Work order ID required" }, { status: 400 });

    const wo = await db.select().from(workOrders).where(eq(workOrders.id, id)).get();
    if (!wo) return NextResponse.json({ error: "Work order not found" }, { status: 404 });

    const prop = await db.select().from(properties).where(and(eq(properties.id, wo.propertyId), eq(properties.userId, session.userId))).get();
    if (!prop) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    // Add completedDate when status changes to completed
    if (updates.status === "completed" && !updates.completedDate) {
      updates.completedDate = new Date().toISOString().split("T")[0];
    }

    await db.update(workOrders).set({ ...updates, updatedAt: new Date().toISOString() }).where(eq(workOrders.id, id)).run();

    const updated = await db.select().from(workOrders).where(eq(workOrders.id, id)).get();
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Work orders PATCH error:", error);
    return NextResponse.json({ error: "Failed to update work order" }, { status: 500 });
  }
}
