
import React, { useMemo, useState } from "react";
import {
  Users,
  Eye,
  MousePointerClick,
  TrendingDown,
  TrendingUp,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Search,
  Share2,
  ExternalLink,
  CalendarDays,
  ArrowUpRight,
} from "lucide-react";

// Demo analytics data for different date ranges
const analyticsData = {
  "7": {
    visitors: 2840,
    pageViews: 8640,
    sessions: 3520,
    bounceRate: 38.4,
    visitorChange: 12.5,
    pageViewChange: 8.2,
    sessionChange: 10.4,
    bounceChange: -3.2,
    chart: [
      { label: "Mon", visitors: 280, views: 820 },
      { label: "Tue", visitors: 350, views: 960 },
      { label: "Wed", visitors: 320, views: 910 },
      { label: "Thu", visitors: 460, views: 1280 },
      { label: "Fri", visitors: 390, views: 1100 },
      { label: "Sat", visitors: 510, views: 1500 },
      { label: "Sun", visitors: 530, views: 2070 },
    ],
  },
  "30": {
    visitors: 12480,
    pageViews: 38650,
    sessions: 15820,
    bounceRate: 41.2,
    visitorChange: 18.6,
    pageViewChange: 14.3,
    sessionChange: 16.8,
    bounceChange: -2.1,
    chart: [
      { label: "Week 1", visitors: 2200, views: 6800 },
      { label: "Week 2", visitors: 2650, views: 7900 },
      { label: "Week 3", visitors: 3100, views: 9200 },
      { label: "Week 4", visitors: 4530, views: 14750 },
    ],
  },
  "90": {
    visitors: 36840,
    pageViews: 108920,
    sessions: 42150,
    bounceRate: 43.6,
    visitorChange: 24.8,
    pageViewChange: 21.5,
    sessionChange: 19.2,
    bounceChange: -1.8,
    chart: [
      { label: "Month 1", visitors: 9200, views: 26800 },
      { label: "Month 2", visitors: 12140, views: 35620 },
      { label: "Month 3", visitors: 15500, views: 46500 },
    ],
  },
};

const trafficSources = [
  { name: "Organic Search", visitors: 5240, percentage: 42, color: "bg-blue-500", icon: Search },
  { name: "Direct", visitors: 3744, percentage: 30, color: "bg-green-500", icon: Globe },
  { name: "Social Media", visitors: 2246, percentage: 18, color: "bg-purple-500", icon: Share2 },
  { name: "Referral", visitors: 1250, percentage: 10, color: "bg-orange-400", icon: ExternalLink },
];

const deviceData = [
  { name: "Desktop", percentage: 48, visitors: "5,990", icon: Monitor, color: "bg-blue-500" },
  { name: "Mobile", percentage: 42, visitors: "5,240", icon: Smartphone, color: "bg-green-500" },
  { name: "Tablet", percentage: 10, visitors: "1,250", icon: Tablet, color: "bg-purple-500" },
];

const topPages = [
  { path: "/", title: "Home Page", views: 12480, change: 14.2 },
  { path: "/services", title: "Our Services", views: 8640, change: 9.8 },
  { path: "/about", title: "About Us", views: 6250, change: 6.4 },
  { path: "/caretotal", title: "CareTotal Plans", views: 4890, change: 18.5 },
  { path: "/contact", title: "Contact Us", views: 3210, change: -2.3 },
];

const formatNumber = (number) =>
  new Intl.NumberFormat("en-IN").format(number);

const Analytics = () => {
  const [dateRange, setDateRange] = useState("30");

  const data = analyticsData[dateRange];

  const stats = [
    {
      title: "Total Visitors",
      value: formatNumber(data.visitors),
      change: data.visitorChange,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
      description: "Unique website visitors",
    },
    {
      title: "Page Views",
      value: formatNumber(data.pageViews),
      change: data.pageViewChange,
      icon: Eye,
      color: "bg-purple-50 text-purple-600",
      description: "Total pages viewed",
    },
    {
      title: "Sessions",
      value: formatNumber(data.sessions),
      change: data.sessionChange,
      icon: MousePointerClick,
      color: "bg-green-50 text-green-600",
      description: "Total user sessions",
    },
    {
      title: "Bounce Rate",
      value: `${data.bounceRate}%`,
      change: data.bounceChange,
      icon: TrendingDown,
      color: "bg-orange-50 text-orange-600",
      description: "Visitors leaving after one page",
      reverse: true,
    },
  ];

  const chartPoints = useMemo(() => {
    const chart = data.chart;
    const width = 700;
    const height = 220;
    const padding = 12;

    const maxValue = Math.max(
      ...chart.map((item) => Math.max(item.visitors, item.views / 3))
    );

    const getX = (index) =>
      padding + (index * (width - padding * 2)) / (chart.length - 1 || 1);

    const getY = (value) =>
      height - padding - (value / maxValue) * (height - padding * 2);

    const visitorPoints = chart.map((item, index) => ({
      x: getX(index),
      y: getY(item.visitors),
    }));

    const viewPoints = chart.map((item, index) => ({
      x: getX(index),
      y: getY(item.views / 3),
    }));

    const toPath = (points) =>
      points.map((point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
      ).join(" ");

    return {
      visitorPath: toPath(visitorPoints),
      viewPath: toPath(viewPoints),
      visitorPoints,
      viewPoints,
      labels: chart.map((item) => item.label),
    };
  }, [data]);

  const periodLabel =
    dateRange === "7"
      ? "Last 7 days"
      : dateRange === "30"
      ? "Last 30 days"
      : "Last 90 days";

  return (
    <div className="min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-blue-600">Analytics</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-800">
            Website Analytics
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Track your website traffic and understand visitor activity.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 shadow-sm">
          <CalendarDays size={18} className="text-gray-500" />

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="cursor-pointer bg-transparent text-sm font-medium text-gray-700 outline-none"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Demo Data Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <Globe size={20} className="mt-0.5 shrink-0 text-blue-600" />
        <div>
          <p className="text-sm font-semibold text-blue-800">
            Website analytics overview
          </p>
          <p className="mt-1 text-xs leading-5 text-blue-700">
            These are sample figures for demonstration. Connect Google
            Analytics to display your actual website traffic.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const positive = stat.reverse
            ? stat.change < 0
            : stat.change >= 0;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-800">
                    {stat.value}
                  </h2>
                </div>

                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon size={22} />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span
                  className={`flex items-center gap-1 text-xs font-semibold ${
                    positive ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {positive ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}
                  {Math.abs(stat.change)}%
                </span>

                <span className="text-xs text-gray-400">
                  vs previous period
                </span>
              </div>

              <p className="mt-2 text-xs text-gray-400">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Traffic Chart */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Traffic Overview
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Visitors and page views over {periodLabel.toLowerCase()}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              Visitors
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
              Page views (scaled)
            </span>
          </div>
        </div>

        <div className="mt-6 w-full overflow-hidden">
          <svg
            viewBox="0 0 700 250"
            className="h-auto w-full min-w-[480px]"
            preserveAspectRatio="none"
          >
            {[40, 90, 140, 190].map((y) => (
              <line
                key={y}
                x1="12"
                y1={y}
                x2="688"
                y2={y}
                stroke="#E5E7EB"
                strokeDasharray="5 5"
              />
            ))}

            <path
              d={chartPoints.viewPath}
              fill="none"
              stroke="#A78BFA"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d={chartPoints.visitorPath}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {chartPoints.visitorPoints.map((point, index) => (
              <circle
                key={`visitor-${index}`}
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#3B82F6"
                stroke="white"
                strokeWidth="2"
              />
            ))}

            {chartPoints.viewPoints.map((point, index) => (
              <circle
                key={`view-${index}`}
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#A78BFA"
                stroke="white"
                strokeWidth="2"
              />
            ))}
          </svg>

          <div className="mt-2 flex justify-between gap-2 text-xs text-gray-400">
            {chartPoints.labels.map((label) => (
              <span key={label} className="text-center">
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Traffic Sources and Devices */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Traffic Sources */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Traffic Sources
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Where your visitors come from.
            </p>
          </div>

          <div className="mt-6 space-y-5">
            {trafficSources.map((source) => {
              const Icon = source.icon;

              return (
                <div key={source.name}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Icon size={17} className="text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {source.name}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-800">
                        {formatNumber(source.visitors)}
                      </span>
                      <span className="ml-2 text-xs text-gray-400">
                        {source.percentage}%
                      </span>
                    </div>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${source.color}`}
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Devices
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Devices used by your website visitors.
            </p>
          </div>

          <div className="mt-6 flex h-4 overflow-hidden rounded-full bg-gray-100">
            {deviceData.map((device) => (
              <div
                key={device.name}
                className={device.color}
                style={{ width: `${device.percentage}%` }}
              />
            ))}
          </div>

          <div className="mt-6 space-y-5">
            {deviceData.map((device) => {
              const Icon = device.icon;

              return (
                <div
                  key={device.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-600">
                      <Icon size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        {device.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {device.visitors} visitors
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-bold text-gray-800">
                    {device.percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Pages */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-2 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Top Performing Pages
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Pages receiving the most views.
            </p>
          </div>

          <span className="text-xs font-medium text-gray-400">
            Sample page performance
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left">
            <thead className="bg-gray-50">
              <tr className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-5 py-4">Page</th>
                <th className="px-5 py-4">Page Views</th>
                <th className="px-5 py-4">Performance</th>
                <th className="px-5 py-4">Change</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {topPages.map((page) => (
                <tr key={page.path} className="transition hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-gray-800">
                      {page.title}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {page.path}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-gray-700">
                    {formatNumber(page.views)}
                  </td>

                  <td className="px-5 py-4">
                    <div className="h-2 w-28 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{
                          width: `${(page.views / topPages[0].views) * 100}%`,
                        }}
                      />
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`flex items-center gap-1 text-xs font-semibold ${
                        page.change >= 0 ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {page.change >= 0 ? (
                        <ArrowUpRight size={14} />
                      ) : (
                        <TrendingDown size={14} />
                      )}
                      {Math.abs(page.change)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
