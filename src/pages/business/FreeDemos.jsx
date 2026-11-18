
import { useState } from "react";
import usePersistentState from "../../hooks/usePersistentState";
import {
  Search,
  Users,
  UserCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  CalendarDays,
  Gift,
  X,
} from "lucide-react";

import { initialDemos } from "../../data/demoData";
import DemoDetailsModal from "../../components/DemoDetailsModal";

const getToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const getDaysRemaining = (endDate) => {
  const today = getToday();
  const end = new Date(`${endDate}T00:00:00`);
  return Math.ceil((end - today) / (1000 * 60 * 60 * 24));
};

const getEffectiveStatus = (demo) => {
  if (demo.status !== "Active") return demo.status;

  return getDaysRemaining(demo.endDate) < 0
    ? "Expired"
    : "Active";
};

const formatDate = (date) => {
  if (!date) return "Not scheduled";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const statusStyles = {
  Active: "bg-blue-50 text-blue-700",
  Converted: "bg-emerald-50 text-emerald-700",
  Expired: "bg-red-50 text-red-700",
  Cancelled: "bg-gray-100 text-gray-600",
};

const FreeDemos = () => {
  const [demos, setDemos] = usePersistentState(
  "lifesprout_demos",
  initialDemos
);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [assignedFilter, setAssignedFilter] = useState("All");
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [notice, setNotice] = useState("");

  const activeDemos = demos.filter(
    (demo) => getEffectiveStatus(demo) === "Active"
  );

  const convertedDemos = demos.filter(
    (demo) => getEffectiveStatus(demo) === "Converted"
  );

  const expiredDemos = demos.filter(
    (demo) => getEffectiveStatus(demo) === "Expired"
  );

  const expiringDemos = activeDemos.filter((demo) => {
    const days = getDaysRemaining(demo.endDate);
    return days >= 0 && days <= 3;
  });

  const stats = [
    {
      title: "Total Demos",
      value: demos.length,
      icon: Gift,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Active Demos",
      value: activeDemos.length,
      icon: UserCheck,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Converted",
      value: convertedDemos.length,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Expired Demos",
      value: expiredDemos.length,
      icon: AlertCircle,
      color: "bg-red-50 text-red-600",
    },
  ];

  const filteredDemos = demos.filter((demo) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      demo.name.toLowerCase().includes(searchText) ||
      demo.email.toLowerCase().includes(searchText) ||
      demo.phone.includes(searchText) ||
      demo.id.toLowerCase().includes(searchText);

    const status = getEffectiveStatus(demo);

    const matchesStatus =
      statusFilter === "All" || status === statusFilter;

    const matchesAssigned =
      assignedFilter === "All" || demo.assignedTo === assignedFilter;

    return matchesSearch && matchesStatus && matchesAssigned;
  });

  const saveDemo = (updatedDemo) => {
    setDemos((prev) =>
      prev.map((demo) =>
        demo.id === updatedDemo.id ? updatedDemo : demo
      )
    );

    setSelectedDemo(null);
    setNotice("Demo details updated successfully.");
  };

  const convertDemo = (demo) => {
    setDemos((prev) =>
      prev.map((item) =>
        item.id === demo.id
          ? { ...item, status: "Converted", followUpDate: "" }
          : item
      )
    );

    setSelectedDemo(null);
    setNotice(`${demo.name}'s demo has been marked as converted.`);
  };

  const teamMembers = [
    ...new Set(demos.map((demo) => demo.assignedTo)),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Free Demo Tracking
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage 14-day demos, customer follow-ups and conversions.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
          <Gift size={17} />
          14-Day Free Demo
        </div>
      </div>

      {/* Notice */}
      {notice && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <p>{notice}</p>
          <button
            onClick={() => setNotice("")}
            aria-label="Close notice"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-800">
                    {stat.value}
                  </h2>
                </div>

                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expiring Soon Reminders */}
      <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-5">
        <div className="mb-4 flex items-center gap-2">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
            <Clock size={19} />
          </div>

          <div>
            <h2 className="font-bold text-slate-800">
              Demo Expiry Reminders
            </h2>
            <p className="text-xs text-gray-500">
              Active demos ending within the next 3 days.
            </p>
          </div>
        </div>

        {expiringDemos.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {expiringDemos.map((demo) => {
              const days = getDaysRemaining(demo.endDate);

              return (
                <div
                  key={demo.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {demo.name}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {demo.service} · Ends {formatDate(demo.endDate)}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-amber-700">
                      {days === 0 ? "Expires today" : `${days} days left`}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedDemo(demo)}
                    className="shrink-0 rounded-lg border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-50"
                  >
                    View
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No demos are expiring within the next 3 days.
          </p>
        )}
      </div>

      {/* Demo Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="space-y-4 border-b border-gray-100 p-5">
          <div>
            <h2 className="font-bold text-slate-800">All Free Demos</h2>
            <p className="mt-1 text-xs text-gray-500">
              View demo customers and track their conversion progress.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search demo customers..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Converted">Converted</option>
              <option value="Expired">Expired</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <select
              value={assignedFilter}
              onChange={(e) => setAssignedFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Team Members</option>
              {teamMembers.map((member) => (
                <option key={member} value={member}>
                  {member}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Service</th>
                <th className="px-5 py-4">Assigned To</th>
                <th className="px-5 py-4">Demo Period</th>
                <th className="px-5 py-4">Remaining</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredDemos.map((demo) => {
                const status = getEffectiveStatus(demo);
                const days = getDaysRemaining(demo.endDate);

                return (
                  <tr
                    key={demo.id}
                    className="transition hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">
                        {demo.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {demo.email}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {demo.id}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-700">
                        {demo.service}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        Via {demo.source}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {demo.assignedTo}
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-xs text-gray-500">
                        {formatDate(demo.startDate)}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        to {formatDate(demo.endDate)}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      {status === "Active" ? (
                        <span
                          className={`text-sm font-semibold ${
                            days <= 3 ? "text-amber-600" : "text-slate-700"
                          }`}
                        >
                          {days === 0 ? "Today" : `${days} days`}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[status]}`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedDemo(demo)}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye size={15} />
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredDemos.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center">
                    <Users
                      size={28}
                      className="mx-auto mb-2 text-gray-300"
                    />
                    <p className="font-medium text-slate-700">
                      No demo records found
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100 px-5 py-4 text-xs text-gray-500">
          Showing {filteredDemos.length} of {demos.length} demos
        </div>
      </div>

      {/* Details Modal */}
      {selectedDemo && (
        <DemoDetailsModal
          demo={selectedDemo}
          onClose={() => setSelectedDemo(null)}
          onSave={saveDemo}
          onConvert={convertDemo}
        />
      )}
    </div>
  );
};

export default FreeDemos;
