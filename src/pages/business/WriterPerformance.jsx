
import React, { useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  FileText,
  CheckCircle,
  Clock,
  Eye,
  Search,
  Filter,
  ArrowUpRight,
  Award,
} from "lucide-react";

import {
  initialWriters,
  initialWriterArticles,
} from "../../data/writerPerformanceData";

import WriterPerformanceModal from "../../components/WriterPerformanceModal";

const WriterPerformance = () => {
  const [writers] = useState(initialWriters);
  const [articles] = useState(initialWriterArticles);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [articleFilter, setArticleFilter] = useState("All");
  const [selectedWriter, setSelectedWriter] = useState(null);

  // Overall statistics
  const totalWriters = writers.length;

  const activeWriters = writers.filter(
    (writer) => writer.status === "Active"
  ).length;

  const totalSubmitted = writers.reduce(
    (total, writer) => total + writer.articlesSubmitted,
    0
  );

  const totalPublished = writers.reduce(
    (total, writer) => total + writer.articlesPublished,
    0
  );

  const totalPending = writers.reduce(
    (total, writer) => total + writer.articlesPending,
    0
  );

  const totalViews = writers.reduce(
    (total, writer) => total + writer.totalViews,
    0
  );

  // Writer search and filtering
  const filteredWriters = useMemo(() => {
    return writers.filter((writer) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        writer.name.toLowerCase().includes(search) ||
        writer.email.toLowerCase().includes(search) ||
        writer.id.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" || writer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [writers, searchTerm, statusFilter]);

  // Article search and filtering
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const writer = writers.find(
        (item) => item.id === article.writerId
      );

      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        writer?.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        articleFilter === "All" || article.status === articleFilter;

      return matchesSearch && matchesStatus;
    });
  }, [articles, writers, searchTerm, articleFilter]);

  const formatNumber = (number) => number.toLocaleString("en-IN");

  const stats = [
    {
      title: "Total Writers",
      value: totalWriters,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
      description: "Registered writers",
    },
    {
      title: "Active Writers",
      value: activeWriters,
      icon: UserCheck,
      color: "bg-green-50 text-green-600",
      description: "Currently active",
    },
    {
      title: "Articles Submitted",
      value: totalSubmitted,
      icon: FileText,
      color: "bg-purple-50 text-purple-600",
      description: "Total submissions",
    },
    {
      title: "Articles Published",
      value: totalPublished,
      icon: CheckCircle,
      color: "bg-emerald-50 text-emerald-600",
      description: "Successfully published",
    },
    {
      title: "Pending Articles",
      value: totalPending,
      icon: Clock,
      color: "bg-orange-50 text-orange-600",
      description: "Awaiting review",
    },
    {
      title: "Total Article Views",
      value: formatNumber(totalViews),
      icon: Eye,
      color: "bg-pink-50 text-pink-600",
      description: "Combined article views",
    },
  ];

  return (
    <div className="space-y-6">

      {/* Page Heading */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Writer Performance
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track writer activity, article submissions and engagement.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700">
          <Award size={18} />
          Writer Analytics
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
                  <h2 className="mt-2 text-2xl font-bold text-gray-800">
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

      {/* Writer Performance Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-bold text-gray-800">
              Individual Writer Performance
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Review submissions, publishing activity and views.
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
                placeholder="Search writer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 sm:w-56"
              />
            </div>

            <div className="relative">
              <Filter
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-8 text-sm outline-none focus:border-blue-500 sm:w-36"
              >
                <option value="All">All Writers</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Writer</th>
                <th className="px-5 py-4 font-semibold">Submitted</th>
                <th className="px-5 py-4 font-semibold">Published</th>
                <th className="px-5 py-4 font-semibold">Pending</th>
                <th className="px-5 py-4 font-semibold">Total Views</th>
                <th className="px-5 py-4 font-semibold">Target Progress</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredWriters.map((writer) => {
                const progress = Math.min(
                  (writer.articlesSubmitted / writer.target) * 100,
                  100
                );

                return (
                  <tr key={writer.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-600">
                          {writer.name.charAt(0)}
                        </div>

                        <div>
                          <p className="font-semibold text-gray-800">
                            {writer.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {writer.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-700">
                      {writer.articlesSubmitted}
                    </td>

                    <td className="px-5 py-4 font-medium text-green-600">
                      {writer.articlesPublished}
                    </td>

                    <td className="px-5 py-4 font-medium text-orange-600">
                      {writer.articlesPending}
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-700">
                      {formatNumber(writer.totalViews)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="w-32">
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="text-gray-500">
                            {writer.articlesSubmitted}/{writer.target}
                          </span>
                          <span className="font-medium text-blue-600">
                            {Math.round(progress)}%
                          </span>
                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-blue-600"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          writer.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {writer.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelectedWriter(writer)}
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                      >
                        View Details
                        <ArrowUpRight size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredWriters.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No writers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100 px-5 py-3 text-xs text-gray-500">
          Showing {filteredWriters.length} of {writers.length} writers
        </div>
      </div>

      {/* Article Performance */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-gray-800">
              Article Performance
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Track individual article views and publishing status.
            </p>
          </div>

          <select
            value={articleFilter}
            onChange={(e) => setArticleFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="All">All Articles</option>
            <option value="Published">Published</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Article Title</th>
                <th className="px-5 py-4 font-semibold">Writer</th>
                <th className="px-5 py-4 font-semibold">Category</th>
                <th className="px-5 py-4 font-semibold">Views</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredArticles.map((article) => {
                const writer = writers.find(
                  (item) => item.id === article.writerId
                );

                return (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-semibold text-gray-800">
                      {article.title}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {writer?.name || "Unknown"}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {article.category}
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-700">
                      {formatNumber(article.views)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          article.status === "Published"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {article.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-gray-500">
                      {article.date}
                    </td>
                  </tr>
                );
              })}

              {filteredArticles.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No articles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Writer Details Modal */}
      {selectedWriter && (
        <WriterPerformanceModal
          writer={selectedWriter}
          articles={articles}
          onClose={() => setSelectedWriter(null)}
        />
      )}
    </div>
  );
};

export default WriterPerformance;

