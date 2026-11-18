
import { useMemo, useState } from "react";
import {
  Activity,
  Search,
  FileText,
  Users,
  CreditCard,
  UserRound,
  UserPlus,
  LogIn,
  LogOut,
  MessageSquare,
  ShieldCheck,
  Trash2,
  Pencil,
  CheckCircle2,
  CalendarDays,
  Filter,
  RefreshCw,
} from "lucide-react";

import { initialActivities } from "../../data/activityData";

const activityConfig = {
  Content: {
    icon: FileText,
    color: "bg-purple-50 text-purple-600",
  },
  Enquiry: {
    icon: MessageSquare,
    color: "bg-blue-50 text-blue-600",
  },
  Login: {
    icon: LogIn,
    color: "bg-emerald-50 text-emerald-600",
  },
  Payment: {
    icon: CreditCard,
    color: "bg-amber-50 text-amber-600",
  },
  Team: {
    icon: Users,
    color: "bg-indigo-50 text-indigo-600",
  },
};

const actionIcons = {
  "Published an article": CheckCircle2,
  "Edited an article": Pencil,
  "Deleted an article": Trash2,
  "Logged in": LogIn,
  "Logged out": LogOut,
  "Added a new admin": UserPlus,
  "Blocked an admin": ShieldCheck,
  "Updated an enquiry": MessageSquare,
  "Assigned an enquiry": UserRound,
  "Initiated a refund": CreditCard,
};

const ActivityLog = () => {
  const [activities, setActivities] = useState(initialActivities);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [userFilter, setUserFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");

  const users = [...new Set(activities.map((item) => item.user))];

  const filteredActivities = useMemo(() => {
    const searchText = search.toLowerCase();

    return activities.filter((item) => {
      const matchesSearch =
        item.user.toLowerCase().includes(searchText) ||
        item.action.toLowerCase().includes(searchText) ||
        item.description.toLowerCase().includes(searchText);

      const matchesType =
        typeFilter === "All" || item.type === typeFilter;

      const matchesUser =
        userFilter === "All" || item.user === userFilter;

      let matchesDate = true;

      if (dateFilter !== "All") {
        const activityDate = new Date(`${item.date}T00:00:00`);
        const today = new Date("2026-11-18T00:00:00");

        if (dateFilter === "Today") {
          matchesDate = item.date === "2026-11-18";
        } else if (dateFilter === "Last 7 Days") {
          const difference =
            (today - activityDate) / (1000 * 60 * 60 * 24);

          matchesDate = difference >= 0 && difference < 7;
        } else if (dateFilter === "Last 30 Days") {
          const difference =
            (today - activityDate) / (1000 * 60 * 60 * 24);

          matchesDate = difference >= 0 && difference < 30;
        }
      }

      return matchesSearch && matchesType && matchesUser && matchesDate;
    });
  }, [activities, search, typeFilter, userFilter, dateFilter]);

  const stats = [
    {
      title: "Total Activities",
      value: activities.length,
      icon: Activity,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Content Updates",
      value: activities.filter((item) => item.type === "Content").length,
      icon: FileText,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Team Activities",
      value: activities.filter((item) => item.type === "Team").length,
      icon: Users,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Login Activities",
      value: activities.filter((item) => item.type === "Login").length,
      icon: UserRound,
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  const formatDate = (date) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("All");
    setUserFilter("All");
    setDateFilter("All");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Activity Log
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track actions performed by admins and team members.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
          <ShieldCheck size={17} />
          Owner Monitoring
        </div>
      </div>

      {/* Stats */}
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

      {/* Activity List */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Filters */}
        <div className="space-y-4 border-b border-gray-100 p-5">
          <div>
            <h2 className="font-bold text-slate-800">Recent Activities</h2>
            <p className="mt-1 text-xs text-gray-500">
              A record of actions performed in your dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search activities..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div className="relative">
              <Filter
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-8 text-sm outline-none focus:border-blue-500"
              >
                <option value="All">All Activity Types</option>
                <option value="Content">Content</option>
                <option value="Enquiry">Enquiry</option>
                <option value="Login">Login</option>
                <option value="Payment">Payment</option>
                <option value="Team">Team</option>
              </select>
            </div>

            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Users</option>
              {users.map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Dates</option>
              <option value="Today">Today</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
            </select>
          </div>

          <div className="flex justify-between gap-3">
            <p className="text-xs text-gray-500">
              Showing {filteredActivities.length} of {activities.length} activities
            </p>

            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <RefreshCw size={13} />
              Clear Filters
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="p-5">
          {filteredActivities.length > 0 ? (
            <div className="space-y-0">
              {filteredActivities.map((item, index) => {
                const config = activityConfig[item.type] || activityConfig.Content;
                const Icon = config.icon;
                const ActionIcon = actionIcons[item.action] || Activity;

                return (
                  <div key={item.id} className="flex gap-4">
                    {/* Timeline Icon */}
                    <div className="flex flex-col items-center">
                      <div className={`z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${config.color}`}>
                        <Icon size={19} />
                      </div>

                      {index !== filteredActivities.length - 1 && (
                        <div className="min-h-16 w-px flex-1 bg-gray-200" />
                      )}
                    </div>

                    {/* Activity Content */}
                    <div className="mb-6 min-w-0 flex-1 rounded-xl border border-gray-100 p-4 transition hover:border-blue-100 hover:bg-slate-50/50">
                      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-slate-800">
                              {item.action}
                            </h3>

                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold text-gray-600">
                              {item.type}
                            </span>
                          </div>

                          <p className="mt-1 text-sm leading-6 text-gray-500">
                            {item.description}
                          </p>
                        </div>

                        <div className="shrink-0 text-left sm:text-right">
                          <p className="text-xs font-semibold text-slate-700">
                            {formatDate(item.date)}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            {item.time}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                          {item.user.charAt(0)}
                        </span>

                        <span className="text-xs font-semibold text-slate-700">
                          {item.user}
                        </span>

                        <span className="text-xs text-gray-400">
                          • {item.role}
                        </span>

                        <span className="ml-auto inline-flex items-center gap-1 text-xs text-gray-400">
                          <ActionIcon size={13} />
                          Activity #{item.id}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-14 text-center">
              <Activity size={30} className="mx-auto mb-3 text-gray-300" />
              <h3 className="font-semibold text-slate-700">
                No activities found
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 px-5 py-4 text-xs text-gray-500">
          Activity records are displayed with the newest entries first.
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
