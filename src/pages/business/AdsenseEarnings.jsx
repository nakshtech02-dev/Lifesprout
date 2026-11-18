
import React, { useMemo, useState } from "react";
import {
  IndianRupee,
  Eye,
  MousePointerClick,
  BarChart3,
  TrendingUp,
  Search,
  CalendarDays,
  Wallet,
} from "lucide-react";

import {
  adsenseSummary,
  monthlyEarnings,
  initialDailyEarnings,
} from "../../data/adsenseData";

const AdsenseEarnings = () => {
  const [dailyEarnings] = useState(initialDailyEarnings);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("All");

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);

  const formatNumber = (number) =>
    new Intl.NumberFormat("en-IN").format(number);

  // Calculate CTR and CPC
  const ctr =
    adsenseSummary.impressions > 0
      ? (adsenseSummary.clicks / adsenseSummary.impressions) * 100
      : 0;

  const cpc =
    adsenseSummary.clicks > 0
      ? adsenseSummary.thisMonthEarnings / adsenseSummary.clicks
      : 0;

  // Find the highest monthly earning for chart scaling
  const maxEarning = Math.max(
    ...monthlyEarnings.map((item) => item.earnings),
    1
  );

  // Filter daily report
  const filteredEarnings = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const search = searchTerm.toLowerCase();

    return dailyEarnings.filter((item) => {
      const itemDate = new Date(`${item.date}T00:00:00`);

      const matchesSearch =
        item.id.toLowerCase().includes(search) ||
        item.date.includes(search);

      let matchesDate = true;

      if (dateFilter === "Today") {
        matchesDate = item.date ===
          `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      } else if (dateFilter === "Last 7 Days") {
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 6);
        matchesDate = itemDate >= startDate && itemDate <= today;
      } else if (dateFilter === "Last 30 Days") {
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 29);
        matchesDate = itemDate >= startDate && itemDate <= today;
      }

      return matchesSearch && matchesDate;
    });
  }, [dailyEarnings, searchTerm, dateFilter]);

  const stats = [
    {
      title: "Today's Earnings",
      value: formatCurrency(adsenseSummary.todayEarnings),
      description: "Estimated earnings today",
      icon: IndianRupee,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "This Month",
      value: formatCurrency(adsenseSummary.thisMonthEarnings),
      description: "November 2026",
      icon: Wallet,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Last Month",
      value: formatCurrency(adsenseSummary.lastMonthEarnings),
      description: "October 2026",
      icon: BarChart3,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Total Earnings",
      value: formatCurrency(adsenseSummary.totalEarnings),
      description: "Lifetime estimated earnings",
      icon: TrendingUp,
      color: "bg-orange-50 text-orange-600",
    },
  ];

  const performanceStats = [
    {
      title: "Ad Impressions",
      value: formatNumber(adsenseSummary.impressions),
      icon: Eye,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Ad Clicks",
      value: formatNumber(adsenseSummary.clicks),
      icon: MousePointerClick,
      color: "text-purple-600 bg-purple-50",
    },
    {
      title: "CTR",
      value: `${ctr.toFixed(2)}%`,
      icon: TrendingUp,
      color: "text-green-600 bg-green-50",
    },
    {
      title: "Average CPC",
      value: formatCurrency(cpc),
      icon: IndianRupee,
      color: "text-orange-600 bg-orange-50",
    },
    {
      title: "Page Views",
      value: formatNumber(adsenseSummary.pageViews),
      icon: BarChart3,
      color: "text-pink-600 bg-pink-50",
    },
  ];

  return (
    <div className="space-y-6">

      {/* Page Heading */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            AdSense Earnings
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor advertising revenue and website ad performance.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-lg bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700">
          <TrendingUp size={18} />
          Revenue Overview
        </div>
      </div>

      {/* Earnings Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-gray-800">
                    {stat.value}
                  </h2>
                  <p className="mt-1 text-xs text-gray-400">
                    {stat.description}
                  </p>
                </div>

                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={21} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Monthly Earnings Chart */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-6">
          <h2 className="font-bold text-gray-800">
            Monthly Earnings Overview
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Estimated advertising revenue throughout the year.
          </p>
        </div>

        <div className="flex h-64 items-end gap-2 overflow-x-auto border-b border-gray-100 pb-2 sm:gap-4">
          {monthlyEarnings.map((item) => {
            const height =
              item.earnings === 0
                ? 0
                : Math.max((item.earnings / maxEarning) * 100, 4);

            return (
              <div
                key={item.month}
                className="flex h-full min-w-9 flex-1 flex-col items-center justify-end gap-2"
              >
                <div className="flex h-full w-full items-end justify-center">
                  <div
                    title={`${item.month}: ${formatCurrency(item.earnings)}`}
                    className={`w-full max-w-12 rounded-t-md transition-all duration-300 ${
                      item.month === "Nov"
                        ? "bg-blue-600"
                        : "bg-blue-200 hover:bg-blue-400"
                    }`}
                    style={{ height: `${height}%` }}
                  />
                </div>

                <span className="text-xs font-medium text-gray-500">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
          <span className="h-2.5 w-2.5 rounded-sm bg-blue-600" />
          November earnings
          <span className="ml-auto">
            Highest: {formatCurrency(maxEarning)}
          </span>
        </div>
      </div>

      {/* Ad Performance */}
      <div>
        <div className="mb-4">
          <h2 className="font-bold text-gray-800">
            Ad Performance
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Understand how visitors interact with your advertisements.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {performanceStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <div className={`rounded-lg p-2 ${stat.color}`}>
                    <Icon size={18} />
                  </div>
                </div>

                <h3 className="mt-3 text-xl font-bold text-gray-800">
                  {stat.value}
                </h3>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Earnings Report */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-bold text-gray-800">
              Daily Earnings Report
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              View daily revenue, impressions and clicks.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search report..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 sm:w-48"
              />
            </div>

            <div className="relative">
              <CalendarDays
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-8 text-sm outline-none focus:border-blue-500 sm:w-40"
              >
                <option value="All">All Dates</option>
                <option value="Today">Today</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Report ID</th>
                <th className="px-5 py-4 font-semibold">Date</th>
                <th className="px-5 py-4 font-semibold">Earnings</th>
                <th className="px-5 py-4 font-semibold">Impressions</th>
                <th className="px-5 py-4 font-semibold">Clicks</th>
                <th className="px-5 py-4 font-semibold">Page Views</th>
                <th className="px-5 py-4 font-semibold">CTR</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredEarnings.map((item) => {
                const dailyCTR =
                  item.impressions > 0
                    ? (item.clicks / item.impressions) * 100
                    : 0;

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium text-gray-700">
                      {item.id}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {item.date}
                    </td>

                    <td className="px-5 py-4 font-semibold text-green-600">
                      {formatCurrency(item.earnings)}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {formatNumber(item.impressions)}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {formatNumber(item.clicks)}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {formatNumber(item.pageViews)}
                    </td>

                    <td className="px-5 py-4 font-medium text-blue-600">
                      {dailyCTR.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}

              {filteredEarnings.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No earnings records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100 px-5 py-3 text-xs text-gray-500">
          Showing {filteredEarnings.length} of {dailyEarnings.length} records
        </div>
      </div>
    </div>
  );
};

export default AdsenseEarnings;
