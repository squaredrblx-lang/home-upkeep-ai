import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { createToken, hashPassword, verifyPassword, getSession } from "@/lib/auth";
import { loginSchema, registerSchema } from "@/lib/validators";
import { generateId } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { initializeDatabase } from "@/lib/db";

// POST /api/auth — login or register
export async function POST(req: NextRequest) {
  try {
    initializeDatabase();
    const body = await req.json();
    const action = body.action; // "login" | "register"

    if (action === "register") {
      const parsed = registerSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
      }

      const { email, password, name } = parsed.data;

      const existing = db.select().from(users).where(eq(users.email, email)).get();
      if (existing) {
        return NextResponse.json({ error: "Email already registered" }, { status: 409 });
      }

      const id = generateId();
      db.insert(users).values({
        id,
        email,
        passwordHash: hashPassword(password),
        name,
        role: "owner",
      }).run();

      const token = await createToken({ userId: id, email, role: "owner" });

      const response = NextResponse.json({ success: true, user: { id, email, name, role: "owner" } });
      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      });

      return response;
    }

    if (action === "login") {
      const parsed = loginSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
      }

      const { email, password } = parsed.data;

      const user = db.select().from(users).where(eq(users.email, email)).get();
      if (!user || !verifyPassword(password, user.passwordHash)) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }

      const token = await createToken({ userId: user.id, email: user.email, role: user.role });

      const response = NextResponse.json({
        success: true,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      });
      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      return response;
    }

    if (action === "logout") {
      const response = NextResponse.json({ success: true });
      response.cookies.delete("token");
      return response;
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/auth — get current session
export async function GET() {
  try {
    initializeDatabase();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ user: null });
    }

    const user = db.select().from(users).where(eq(users.id, session.userId)).get();
    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
