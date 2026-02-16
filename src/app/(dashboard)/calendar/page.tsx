"use client";

import { useEffect, useState } from "react";
import { getPriorityColor, getStatusColor, formatDate } from "@/lib/utils";

interface WorkOrder {
  id: string;
  title: string;
  description: string;
  propertyId: string;
  propertyName: string;
  priority: string;
  status: string;
  scheduledDate: string | null;
  createdAt: string;
}

export default function CalendarPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/work-orders")
      .then((r) => r.json())
      .then((data) => {
        setWorkOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Calculate days in month and starting day offset
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDayOffset = new Date(year, month, 1).getDay();

  // Get today's date for highlighting
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  // Get work orders for a specific date
  const getWorkOrdersForDate = (dateStr: string) => {
    return workOrders.filter((wo) => {
      if (!wo.scheduledDate) return false;
      const woDate = new Date(wo.scheduledDate);
      const woDateStr = `${woDate.getFullYear()}-${String(woDate.getMonth() + 1).padStart(2, "0")}-${String(woDate.getDate()).padStart(2, "0")}`;
      return woDateStr === dateStr;
    });
  };

  // Get priority dot color
  const getPriorityDotColor = (priority: string): string => {
    switch (priority) {
      case "emergency": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  // Generate calendar cells
  const calendarCells = [];

  // Empty cells for offset
  for (let i = 0; i < startDayOffset; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="min-h-[80px] border border-gray-100" />);
  }

  // Day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayWorkOrders = getWorkOrdersForDate(dateStr);
    const isToday = dateStr === todayStr;
    const isSelected = dateStr === selectedDate;

    calendarCells.push(
      <div
        key={day}
        onClick={() => setSelectedDate(dateStr)}
        className={`min-h-[80px] border border-gray-100 p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
          isToday ? "ring-2 ring-blue-500" : ""
        } ${isSelected ? "bg-blue-50" : ""}`}
      >
        <div className={`text-sm font-medium mb-2 ${isToday ? "text-blue-600" : "text-gray-900"}`}>
          {day}
        </div>
        <div className="flex flex-wrap gap-1">
          {dayWorkOrders.map((wo) => (
            <div
              key={wo.id}
              className={`w-2 h-2 rounded-full ${getPriorityDotColor(wo.priority)}`}
              title={wo.title}
            />
          ))}
        </div>
      </div>
    );
  }

  // Get work orders for selected date
  const selectedWorkOrders = selectedDate ? getWorkOrdersForDate(selectedDate) : [];

  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4" />
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="h-10 bg-gray-200 rounded mb-4" />
            <div className="grid grid-cols-7 gap-2">
              {[...Array(35)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-100 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
        <p className="text-sm text-gray-500 mt-1">View and manage scheduled work orders</p>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goToPreviousMonth}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            &lt; Previous
          </button>
          <h2 className="text-lg font-semibold text-gray-900">
            {monthNames[month]} {year}
          </h2>
          <button
            onClick={goToNextMonth}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Next &gt;
          </button>
        </div>

        {/* Day of week header */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarCells}
        </div>
      </div>

      {/* Selected date work orders */}
      {selectedDate && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Work Orders for {formatDate(selectedDate)}
          </h2>
          {selectedWorkOrders.length > 0 ? (
            <div className="space-y-3">
              {selectedWorkOrders.map((wo) => (
                <div key={wo.id} className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 mb-1">{wo.title}</div>
                    <div className="text-xs text-gray-500">{wo.propertyName}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(wo.priority)}`}>
                      {wo.priority}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(wo.status)}`}>
                      {wo.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">No work orders scheduled for this date.</p>
          )}
        </div>
      )}
    </div>
  );
}
