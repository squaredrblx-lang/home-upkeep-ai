"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  formatCurrency,
  formatDate,
  getConditionColor,
  getStatusColor,
  getPriorityColor,
  getHealthColor,
  getHealthBg,
} from "@/lib/utils";

interface Property {
  id: string;
  name: string;
  address: string;
  type: string;
  healthScore: number;
  yearBuilt: number;
  squareFeet: number;
  units: number;
  purchasePrice: number;
  currentValue: number;
}

interface System {
  id: string;
  propertyId: string;
  category: string;
  name: string;
  make: string;
  model: string;
  installDate: string;
  expectedLifespanYears: number;
  condition: string;
  riskScore: number;
}

interface WorkOrder {
  id: string;
  propertyId: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  estimatedCost: number;
  scheduledDate: string;
}

interface Expense {
  id: string;
  propertyId: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  vendor: string;
}

type Tab = "overview" | "systems" | "work-orders" | "expenses";

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<Property | null>(null);
  const [systems, setSystems] = useState<System[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add forms state
  const [showAddSystem, setShowAddSystem] = useState(false);
  const [showAddWorkOrder, setShowAddWorkOrder] = useState(false);

  // System form state
  const [systemForm, setSystemForm] = useState({
    category: "",
    name: "",
    make: "",
    model: "",
    installDate: "",
    expectedLifespanYears: "",
    condition: "",
  });

  // Work order form state
  const [workOrderForm, setWorkOrderForm] = useState({
    title: "",
    description: "",
    priority: "",
    category: "",
    estimatedCost: "",
    scheduledDate: "",
  });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [propertiesRes, systemsRes, workOrdersRes, expensesRes] = await Promise.all([
        fetch("/api/properties"),
        fetch(`/api/systems?propertyId=${params.id}`),
        fetch(`/api/work-orders?propertyId=${params.id}`),
        fetch(`/api/expenses?propertyId=${params.id}`),
      ]);

      if (!propertiesRes.ok || !systemsRes.ok || !workOrdersRes.ok || !expensesRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [propertiesData, systemsData, workOrdersData, expensesData] = await Promise.all([
        propertiesRes.json(),
        systemsRes.json(),
        workOrdersRes.json(),
        expensesRes.json(),
      ]);

      // Find the property by id
      const foundProperty = propertiesData.find((p: Property) => p.id === params.id);
      if (!foundProperty) {
        throw new Error("Property not found");
      }

      setProperty(foundProperty);
      setSystems(systemsData);
      setWorkOrders(workOrdersData);
      setExpenses(expensesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddSystem(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/systems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: params.id,
          category: systemForm.category,
          name: systemForm.name,
          make: systemForm.make,
          model: systemForm.model,
          installDate: systemForm.installDate,
          expectedLifespanYears: parseInt(systemForm.expectedLifespanYears),
          condition: systemForm.condition,
        }),
      });

      if (!res.ok) throw new Error("Failed to add system");

      // Refresh systems
      const systemsRes = await fetch(`/api/systems?propertyId=${params.id}`);
      setSystems(await systemsRes.json());

      // Reset form
      setSystemForm({
        category: "",
        name: "",
        make: "",
        model: "",
        installDate: "",
        expectedLifespanYears: "",
        condition: "",
      });
      setShowAddSystem(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add system");
    }
  }

  async function handleAddWorkOrder(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/work-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: params.id,
          title: workOrderForm.title,
          description: workOrderForm.description,
          priority: workOrderForm.priority,
          category: workOrderForm.category,
          estimatedCost: parseFloat(workOrderForm.estimatedCost),
          scheduledDate: workOrderForm.scheduledDate,
        }),
      });

      if (!res.ok) throw new Error("Failed to add work order");

      // Refresh work orders
      const workOrdersRes = await fetch(`/api/work-orders?propertyId=${params.id}`);
      setWorkOrders(await workOrdersRes.json());

      // Reset form
      setWorkOrderForm({
        title: "",
        description: "",
        priority: "",
        category: "",
        estimatedCost: "",
        scheduledDate: "",
      });
      setShowAddWorkOrder(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add work order");
    }
  }

  function getRiskScoreColor(score: number): string {
    if (score >= 80) return "text-red-600";
    if (score >= 60) return "text-orange-600";
    if (score >= 40) return "text-yellow-600";
    return "text-green-600";
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error || "Property not found"}</p>
          <Link href="/properties" className="text-blue-600 hover:underline mt-2 inline-block">
            ← Back to properties
          </Link>
        </div>
      </div>
    );
  }

  const openWorkOrders = workOrders.filter((wo) => wo.status === "open").length;
  const ytdExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/properties" className="text-blue-600 hover:underline mb-2 inline-block">
          ← Back to properties
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{property.name}</h1>
            <p className="text-gray-600">{property.address}</p>
          </div>
          <div className="flex gap-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${getHealthBg(
                property.healthScore
              )} ${getHealthColor(property.healthScore)}`}
            >
              Health: {property.healthScore}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
              {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-4">
          {[
            { key: "overview", label: "Overview" },
            { key: "systems", label: "Systems" },
            { key: "work-orders", label: "Work Orders" },
            { key: "expenses", label: "Expenses" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as Tab)}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600">Health Score</div>
              <div className={`text-3xl font-bold ${getHealthColor(property.healthScore)}`}>
                {property.healthScore}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600">Systems</div>
              <div className="text-3xl font-bold">{systems.length}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600">Open Work Orders</div>
              <div className="text-3xl font-bold">{openWorkOrders}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600">YTD Expenses</div>
              <div className="text-3xl font-bold">{formatCurrency(ytdExpenses)}</div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Property Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Year Built</div>
                <div className="font-semibold">{property.yearBuilt}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Square Feet</div>
                <div className="font-semibold">{property.squareFeet.toLocaleString()} sq ft</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Units</div>
                <div className="font-semibold">{property.units}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Purchase Price</div>
                <div className="font-semibold">{formatCurrency(property.purchasePrice)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Current Value</div>
                <div className="font-semibold">{formatCurrency(property.currentValue)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "systems" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Systems</h2>
            <button
              onClick={() => setShowAddSystem(!showAddSystem)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {showAddSystem ? "Cancel" : "Add System"}
            </button>
          </div>

          {showAddSystem && (
            <form onSubmit={handleAddSystem} className="bg-white rounded-lg shadow p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    required
                    value={systemForm.category}
                    onChange={(e) => setSystemForm({ ...systemForm, category: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Select category</option>
                    <option value="hvac">HVAC</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="roof">Roof</option>
                    <option value="foundation">Foundation</option>
                    <option value="windows">Windows</option>
                    <option value="doors">Doors</option>
                    <option value="insulation">Insulation</option>
                    <option value="fire_safety">Fire Safety</option>
                    <option value="elevator">Elevator</option>
                    <option value="appliance">Appliance</option>
                    <option value="exterior">Exterior</option>
                    <option value="interior">Interior</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={systemForm.name}
                    onChange={(e) => setSystemForm({ ...systemForm, name: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Make</label>
                  <input
                    type="text"
                    required
                    value={systemForm.make}
                    onChange={(e) => setSystemForm({ ...systemForm, make: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Model</label>
                  <input
                    type="text"
                    required
                    value={systemForm.model}
                    onChange={(e) => setSystemForm({ ...systemForm, model: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Install Date</label>
                  <input
                    type="date"
                    required
                    value={systemForm.installDate}
                    onChange={(e) => setSystemForm({ ...systemForm, installDate: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Expected Lifespan (Years)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={systemForm.expectedLifespanYears}
                    onChange={(e) =>
                      setSystemForm({ ...systemForm, expectedLifespanYears: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Condition</label>
                  <select
                    required
                    value={systemForm.condition}
                    onChange={(e) => setSystemForm({ ...systemForm, condition: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Select condition</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Add System
              </button>
            </form>
          )}

          <div className="space-y-3">
            {systems.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                No systems found. Add a system to get started.
              </div>
            ) : (
              systems.map((system) => (
                <div key={system.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{system.name}</h3>
                      <div className="flex gap-2 mt-2">
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700">
                          {system.category.charAt(0).toUpperCase() + system.category.slice(1)}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${getConditionColor(
                            system.condition
                          )}`}
                        >
                          {system.condition.charAt(0).toUpperCase() + system.condition.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getRiskScoreColor(system.riskScore)}`}>
                        {system.riskScore}
                      </div>
                      <div className="text-xs text-gray-500">Risk Score</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                    <div>
                      <div className="text-gray-600">Make/Model</div>
                      <div className="font-semibold">
                        {system.make} {system.model}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Install Date</div>
                      <div className="font-semibold">{formatDate(system.installDate)}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Expected Lifespan</div>
                      <div className="font-semibold">{system.expectedLifespanYears} years</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "work-orders" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Work Orders</h2>
            <button
              onClick={() => setShowAddWorkOrder(!showAddWorkOrder)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {showAddWorkOrder ? "Cancel" : "Add Work Order"}
            </button>
          </div>

          {showAddWorkOrder && (
            <form
              onSubmit={handleAddWorkOrder}
              className="bg-white rounded-lg shadow p-6 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={workOrderForm.title}
                    onChange={(e) => setWorkOrderForm({ ...workOrderForm, title: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    required
                    value={workOrderForm.description}
                    onChange={(e) =>
                      setWorkOrderForm({ ...workOrderForm, description: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select
                    required
                    value={workOrderForm.priority}
                    onChange={(e) =>
                      setWorkOrderForm({ ...workOrderForm, priority: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Select priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={workOrderForm.category}
                    onChange={(e) =>
                      setWorkOrderForm({ ...workOrderForm, category: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Estimated Cost</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={workOrderForm.estimatedCost}
                    onChange={(e) =>
                      setWorkOrderForm({ ...workOrderForm, estimatedCost: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    required
                    value={workOrderForm.scheduledDate}
                    onChange={(e) =>
                      setWorkOrderForm({ ...workOrderForm, scheduledDate: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Add Work Order
              </button>
            </form>
          )}

          <div className="space-y-3">
            {workOrders.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                No work orders found. Add a work order to get started.
              </div>
            ) : (
              workOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{order.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{order.description}</p>
                      <div className="flex gap-2 mt-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(
                            order.priority
                          )}`}
                        >
                          {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{formatCurrency(order.estimatedCost)}</div>
                      <div className="text-xs text-gray-500">Estimated Cost</div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    Scheduled: {formatDate(order.scheduledDate)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "expenses" && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Expenses</h2>

          {expenses.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
              No expenses found.
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vendor
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {expenses.map((expense) => (
                      <tr key={expense.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {formatDate(expense.date)}
                        </td>
                        <td className="px-6 py-4 text-sm">{expense.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700">
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{expense.vendor}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold">
                          {formatCurrency(expense.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-right font-bold">
                        Total:
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-lg">
                        {formatCurrency(ytdExpenses)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
