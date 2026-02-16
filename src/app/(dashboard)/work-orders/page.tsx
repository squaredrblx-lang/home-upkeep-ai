"use client";

import { useEffect, useState } from "react";
import { formatCurrency, formatDate, getStatusColor, getPriorityColor } from "@/lib/utils";

interface WorkOrder {
  id: string;
  propertyId: string;
  propertyName: string;
  contractorId?: string;
  contractorName?: string;
  title: string;
  description: string;
  status: "open" | "assigned" | "in_progress" | "awaiting_parts" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "emergency";
  category: "repair" | "replacement" | "preventive" | "inspection" | "cosmetic" | "emergency";
  estimatedCost: number;
  actualCost?: number;
  scheduledDate?: string;
  completedDate?: string;
  createdAt: string;
}

interface Property {
  id: string;
  name: string;
  address: string;
}

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  // Form state
  const [formData, setFormData] = useState<{
    propertyId: string;
    title: string;
    description: string;
    priority: "low" | "medium" | "high" | "emergency";
    category: "repair" | "replacement" | "preventive" | "inspection" | "cosmetic" | "emergency";
    estimatedCost: number;
    scheduledDate: string;
  }>({
    propertyId: "",
    title: "",
    description: "",
    priority: "medium",
    category: "repair",
    estimatedCost: 0,
    scheduledDate: "",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/work-orders").then((r) => r.json()),
      fetch("/api/properties").then((r) => r.json()),
    ])
      .then(([workOrdersData, propertiesData]) => {
        setWorkOrders(workOrdersData);
        setProperties(propertiesData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch("/api/work-orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (response.ok) {
        // Refresh work orders
        const updated = await fetch("/api/work-orders").then((r) => r.json());
        setWorkOrders(updated);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/work-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Refresh work orders
        const updated = await fetch("/api/work-orders").then((r) => r.json());
        setWorkOrders(updated);
        setShowForm(false);
        setFormData({
          propertyId: "",
          title: "",
          description: "",
          priority: "medium",
          category: "repair",
          estimatedCost: 0,
          scheduledDate: "",
        });
      }
    } catch (error) {
      console.error("Failed to create work order:", error);
    }
  };

  // Client-side filtering
  const filteredWorkOrders = workOrders.filter((wo) => {
    const statusMatch = statusFilter === "all" || wo.status === statusFilter;
    const priorityMatch = priorityFilter === "all" || wo.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Work Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage maintenance and repair tasks</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          {showForm ? "Cancel" : "+ New Work Order"}
        </button>
      </div>

      {/* New Work Order Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Work Order</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
                <select
                  value={formData.propertyId}
                  onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a property</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Fix leaking faucet"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the issue and any relevant details..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as "low" | "medium" | "high" | "emergency" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as "repair" | "replacement" | "preventive" | "inspection" | "cosmetic" | "emergency" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="repair">Repair</option>
                  <option value="replacement">Replacement</option>
                  <option value="preventive">Preventive</option>
                  <option value="inspection">Inspection</option>
                  <option value="cosmetic">Cosmetic</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost</label>
                <input
                  type="number"
                  value={formData.estimatedCost}
                  onChange={(e) => setFormData({ ...formData, estimatedCost: parseFloat(e.target.value) || 0 })}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
                <input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Create Work Order
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="awaiting_parts">Awaiting Parts</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>

          <div className="flex items-end">
            <div className="text-sm text-gray-500">
              Showing {filteredWorkOrders.length} of {workOrders.length} work orders
            </div>
          </div>
        </div>
      </div>

      {/* Work Orders List */}
      <div className="grid gap-4">
        {filteredWorkOrders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="text-4xl text-gray-300 mb-3">📋</div>
            <p className="text-gray-500 text-sm">
              {workOrders.length === 0
                ? "No work orders yet. Create your first work order to get started."
                : "No work orders match the selected filters."}
            </p>
          </div>
        ) : (
          filteredWorkOrders.map((wo) => (
            <div key={wo.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-bold text-gray-900">{wo.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(wo.priority)}`}>
                      {wo.priority}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Property:</span>{" "}
                      <span className="text-gray-900 font-medium">{wo.propertyName}</span>
                    </div>
                    {wo.contractorName && (
                      <div>
                        <span className="text-gray-500">Contractor:</span>{" "}
                        <span className="text-gray-900 font-medium">{wo.contractorName}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Cost:</span>{" "}
                      <span className="text-gray-900 font-medium">{formatCurrency(wo.estimatedCost)}</span>
                    </div>
                    {wo.scheduledDate && (
                      <div>
                        <span className="text-gray-500">Scheduled:</span>{" "}
                        <span className="text-gray-900 font-medium">{formatDate(wo.scheduledDate)}</span>
                      </div>
                    )}
                  </div>

                  {wo.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{wo.description}</p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(wo.status)}`}>
                    {wo.status.replace("_", " ")}
                  </span>

                  <select
                    value={wo.status}
                    onChange={(e) => handleStatusChange(wo.id, e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="open">Open</option>
                    <option value="assigned">Assigned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="awaiting_parts">Awaiting Parts</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
