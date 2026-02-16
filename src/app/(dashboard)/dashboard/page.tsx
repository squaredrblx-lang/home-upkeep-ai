"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDate, getPriorityColor, getStatusColor, getConditionColor } from "@/lib/utils";

interface DashboardData {
  totalProperties: number;
  totalUnits: number;
  avgHealthScore: number;
  openWorkOrders: number;
  urgentItems: number;
  totalExpensesThisYear: number;
  totalExpensesLastYear: number;
  upcomingMaintenance: Array<{ id: string; title: string; nextDue: string; propertyName: string }>;
  criticalSystems: Array<{ id: string; name: string; category: string; condition: string; riskScore: number; propertyName: string }>;
  recentWorkOrders: Array<{ id: string; title: string; status: string; priority: string; propertyName: string; createdAt: string }>;
  expensesByCategory: Array<{ name: string; value: number }>;
  expensesByMonth: Array<{ month: string; amount: number }>;
  propertySummaries: Array<{ id: string; name: string; healthScore: number; openWorkOrders: number; totalExpenses: number; systemCount: number; tenantCount: number }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return <p className="text-gray-500">Failed to load dashboard.</p>;

  const maxExpense = Math.max(...data.expensesByMonth.map((e) => e.amount), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Portfolio overview and maintenance alerts</p>
        </div>
        <Link
          href="/properties/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Add Property
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Properties" value={data.totalProperties} sub={`${data.totalUnits} total units`} color="blue" />
        <StatCard label="Health Score" value={`${data.avgHealthScore}%`} sub="Portfolio average" color={data.avgHealthScore >= 70 ? "green" : data.avgHealthScore >= 50 ? "yellow" : "red"} />
        <StatCard label="Open Work Orders" value={data.openWorkOrders} sub={`${data.urgentItems} urgent`} color={data.urgentItems > 0 ? "red" : "blue"} />
        <StatCard label="Expenses (YTD)" value={formatCurrency(data.totalExpensesThisYear)} sub={`Last year: ${formatCurrency(data.totalExpensesLastYear)}`} color="green" />
        <StatCard label="Urgent Items" value={data.urgentItems} sub="Need attention now" color={data.urgentItems > 0 ? "red" : "green"} />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Expense chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Monthly Expenses (Last 12 Months)</h2>
            <div className="flex items-end gap-1 h-40">
              {data.expensesByMonth.map((e, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-[10px] text-gray-400">{e.amount > 0 ? formatCurrency(e.amount) : ""}</div>
                  <div
                    className="w-full bg-blue-200 rounded-t-sm hover:bg-blue-400 transition-colors min-h-[2px]"
                    style={{ height: `${(e.amount / maxExpense) * 120}px` }}
                    title={`${e.month}: ${formatCurrency(e.amount)}`}
                  />
                  <div className="text-[10px] text-gray-500">{e.month}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Property summaries */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Property Health</h2>
            <div className="space-y-3">
              {data.propertySummaries.map((p) => (
                <Link key={p.id} href={`/properties/${p.id}`} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${p.healthScore >= 70 ? "bg-green-100 text-green-700" : p.healthScore >= 50 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                    {p.healthScore}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{p.name}</div>
                    <div className="text-xs text-gray-500">
                      {p.systemCount} systems &middot; {p.tenantCount} tenants &middot; {p.openWorkOrders} open orders
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">{formatCurrency(p.totalExpenses)} YTD</div>
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${p.healthScore >= 70 ? "bg-green-500" : p.healthScore >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                      style={{ width: `${p.healthScore}%` }}
                    />
                  </div>
                </Link>
              ))}
              {data.propertySummaries.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-8">No properties yet. Add your first property to get started.</p>
              )}
            </div>
          </div>

          {/* Recent work orders */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900">Recent Work Orders</h2>
              <Link href="/work-orders" className="text-xs text-blue-600 hover:text-blue-700">View all</Link>
            </div>
            <div className="space-y-2">
              {data.recentWorkOrders.map((wo) => (
                <div key={wo.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(wo.priority)}`}>
                    {wo.priority}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-900 truncate">{wo.title}</div>
                    <div className="text-xs text-gray-500">{wo.propertyName}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(wo.status)}`}>
                    {wo.status.replace("_", " ")}
                  </span>
                </div>
              ))}
              {data.recentWorkOrders.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No work orders yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right column — 1/3 */}
        <div className="space-y-6">
          {/* Critical Systems */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Critical Systems</h2>
            <div className="space-y-3">
              {data.criticalSystems.map((s) => (
                <div key={s.id} className="p-3 rounded-lg bg-red-50 border border-red-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{s.name}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${s.riskScore >= 80 ? "bg-red-200 text-red-800 animate-pulse-slow" : "bg-orange-200 text-orange-800"}`}>
                      Risk: {s.riskScore}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">{s.propertyName} &middot; {s.category}</div>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${getConditionColor(s.condition)}`}>
                    {s.condition}
                  </span>
                </div>
              ))}
              {data.criticalSystems.length === 0 && (
                <p className="text-sm text-green-600 text-center py-4">All systems healthy!</p>
              )}
            </div>
          </div>

          {/* Upcoming Maintenance */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900">Upcoming Maintenance</h2>
              <Link href="/calendar" className="text-xs text-blue-600 hover:text-blue-700">Calendar</Link>
            </div>
            <div className="space-y-3">
              {data.upcomingMaintenance.map((m) => (
                <div key={m.id} className="flex items-start gap-3 p-2">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-900">{m.title}</div>
                    <div className="text-xs text-gray-500">{m.propertyName} &middot; Due {m.nextDue ? formatDate(m.nextDue) : "N/A"}</div>
                  </div>
                </div>
              ))}
              {data.upcomingMaintenance.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No upcoming maintenance.</p>
              )}
            </div>
          </div>

          {/* Expenses by Category */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Expenses by Category (YTD)</h2>
            <div className="space-y-2">
              {data.expensesByCategory.map((c) => {
                const maxCat = data.expensesByCategory[0]?.value || 1;
                return (
                  <div key={c.name}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600 capitalize">{c.name}</span>
                      <span className="text-gray-900 font-medium">{formatCurrency(c.value)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 rounded-full" style={{ width: `${(c.value / maxCat) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
              {data.expensesByCategory.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No expenses recorded.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub: string; color: string }) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 border-blue-100",
    green: "bg-green-50 border-green-100",
    red: "bg-red-50 border-red-100",
    yellow: "bg-yellow-50 border-yellow-100",
  };

  return (
    <div className={`rounded-xl border p-5 ${colorMap[color] || colorMap.blue}`}>
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</div>
      <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{sub}</div>
    </div>
  );
}
