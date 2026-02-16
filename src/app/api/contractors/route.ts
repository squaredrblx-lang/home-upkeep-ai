import { NextRequest, NextResponse } from "next/server";
import { db, initializeDatabase } from "@/lib/db";
import { contractors } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { contractorSchema } from "@/lib/validators";
import { generateId } from "@/lib/utils";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    await initializeDatabase();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const list = await db.select().from(contractors).where(eq(contractors.userId, session.userId)).orderBy(desc(contractors.rating)).all();
    return NextResponse.json(list);
  } catch (error) {
    console.error("Contractors GET error:", error);
    return NextResponse.json({ error: "Failed to fetch contractors" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await initializeDatabase();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = contractorSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

    const id = generateId();
    await db.insert(contractors).values({ id, userId: session.userId, ...parsed.data }).run();

    const contractor = await db.select().from(contractors).where(eq(contractors.id, id)).get();
    return NextResponse.json(contractor, { status: 201 });
  } catch (error) {
    console.error("Contractors POST error:", error);
    return NextResponse.json({ error: "Failed to create contractor" }, { status: 500 });
  }
}
