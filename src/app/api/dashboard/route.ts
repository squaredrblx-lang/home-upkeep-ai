import { NextResponse } from "next/server";
import { db, initializeDatabase } from "@/lib/db";
import { properties, systems, workOrders, expenses, maintenanceSchedules, tenants } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    await initializeDatabase();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userProps = await db.select().from(properties).where(eq(properties.userId, session.userId)).all();
    const propIds = userProps.map(p => p.id);

    if (propIds.length === 0) {
      return NextResponse.json({
        totalProperties: 0,
        totalUnits: 0,
        avgHealthScore: 0,
        openWorkOrders: 0,
        urgentItems: 0,
        totalExpensesThisYear: 0,
        totalExpensesLastYear: 0,
        upcomingMaintenance: [],
        criticalSystems: [],
        recentWorkOrders: [],
        expensesByCategory: [],
        expensesByMonth: [],
        propertySummaries: [],
      });
    }

    const allSystems = (await db.select().from(systems).all()).filter(s => propIds.includes(s.propertyId));
    const allWorkOrders = (await db.select().from(workOrders).all()).filter(wo => propIds.includes(wo.propertyId));
    const allExpenses = (await db.select().from(expenses).all()).filter(e => propIds.includes(e.propertyId));
    const allSchedules = (await db.select().from(maintenanceSchedules).all()).filter(ms => propIds.includes(ms.propertyId));
    const allTenants = (await db.select().from(tenants).all()).filter(t => propIds.includes(t.propertyId));

    const now = new Date();
    const thisYear = now.getFullYear().toString();
    const lastYear = (now.getFullYear() - 1).toString();

    const openWO = allWorkOrders.filter(wo => wo.status !== "completed" && wo.status !== "cancelled");
    const urgentItems = allSystems.filter(s => s.riskScore && s.riskScore >= 70).length
      + allWorkOrders.filter(wo => wo.priority === "emergency" && wo.status !== "completed").length;

    const thisYearExpenses = allExpenses.filter(e => e.date.startsWith(thisYear)).reduce((sum, e) => sum + e.amount, 0);
    const lastYearExpenses = allExpenses.filter(e => e.date.startsWith(lastYear)).reduce((sum, e) => sum + e.amount, 0);

    const avgHealth = userProps.length > 0
      ? Math.round(userProps.reduce((sum, p) => sum + (p.healthScore || 0), 0) / userProps.length)
      : 0;

    const upcomingMaintenance = allSchedules
      .filter(ms => ms.nextDue && ms.isActive)
      .sort((a, b) => (a.nextDue || "").localeCompare(b.nextDue || ""))
      .slice(0, 5)
      .map(ms => {
        const prop = userProps.find(p => p.id === ms.propertyId);
        return { ...ms, propertyName: prop?.name || "Unknown" };
      });

    const criticalSystems = allSystems
      .filter(s => s.riskScore && s.riskScore >= 50)
      .sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0))
      .slice(0, 5)
      .map(s => {
        const prop = userProps.find(p => p.id === s.propertyId);
        return { ...s, propertyName: prop?.name || "Unknown" };
      });

    const recentWorkOrders = allWorkOrders
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 5)
      .map(wo => {
        const prop = userProps.find(p => p.id === wo.propertyId);
        return { ...wo, propertyName: prop?.name || "Unknown" };
      });

    // Expenses by category
    const categoryMap = new Map<string, number>();
    allExpenses.filter(e => e.date.startsWith(thisYear)).forEach(e => {
      categoryMap.set(e.category, (categoryMap.get(e.category) || 0) + e.amount);
    });
    const expensesByCategory = Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

    // Expenses by month (last 12 months)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const expensesByMonth = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const monthTotal = allExpenses.filter(e => e.date.startsWith(key)).reduce((sum, e) => sum + e.amount, 0);
      expensesByMonth.push({ month: monthNames[date.getMonth()], amount: monthTotal });
    }

    const propertySummaries = userProps.map(p => ({
      id: p.id,
      name: p.name,
      healthScore: p.healthScore || 0,
      openWorkOrders: allWorkOrders.filter(wo => wo.propertyId === p.id && wo.status !== "completed" && wo.status !== "cancelled").length,
      totalExpenses: allExpenses.filter(e => e.propertyId === p.id && e.date.startsWith(thisYear)).reduce((sum, e) => sum + e.amount, 0),
      systemCount: allSystems.filter(s => s.propertyId === p.id).length,
      tenantCount: allTenants.filter(t => t.propertyId === p.id && t.isActive).length,
    }));

    return NextResponse.json({
      totalProperties: userProps.length,
      totalUnits: userProps.reduce((sum, p) => sum + p.unitsCount, 0),
      avgHealthScore: avgHealth,
      openWorkOrders: openWO.length,
      urgentItems,
      totalExpensesThisYear: thisYearExpenses,
      totalExpensesLastYear: lastYearExpenses,
      upcomingMaintenance,
      criticalSystems,
      recentWorkOrders,
      expensesByCategory,
      expensesByMonth,
      propertySummaries,
    });
  } catch (error) {
    console.error("Dashboard GET error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard" }, { status: 500 });
  }
}
