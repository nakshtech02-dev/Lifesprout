
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  FileText,
  Eye,
  Edit,
  Trash2,
  CalendarDays,
  CheckCircle,
  Clock,
  FileEdit,
  X,
  ArrowUpRight,
} from "lucide-react";

import { initialContent } from "../../data/contentCalendarData";

const Articles = () => {
  const navigate = useNavigate();

  // Only use Blog content, not Health Shorts.
 const [articles, setArticles] = useState(() => {
  try {
    const saved = localStorage.getItem("lifesprout_articles");

    return saved
      ? JSON.parse(saved)
      : initialContent.filter((item) => item.type === "Blog");
  } catch {
    return initialContent.filter((item) => item.type === "Blog");
  }
});

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Get unique article categories.
  const categories = [
    "All",
    ...new Set(articles.map((article) => article.category).filter(Boolean)),
  ];

  // Article statistics.
  const totalArticles = articles.length;

  const publishedArticles = articles.filter(
    (article) => article.status === "Published"
  ).length;

  const draftArticles = articles.filter(
    (article) => article.status === "Draft"
  ).length;

  const scheduledArticles = articles.filter(
    (article) => article.status === "Scheduled"
  ).length;

  // Search and filter articles.
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        article.title?.toLowerCase().includes(search) ||
        article.author?.toLowerCase().includes(search) ||
        article.category?.toLowerCase().includes(search) ||
        article.id?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" || article.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All" ||
        article.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [articles, searchTerm, statusFilter, categoryFilter]);

  // Format article date.
  const formatDate = (date) => {
    if (!date) return "Not scheduled";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Publish article.
 const publishArticle = (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to publish this article?"
  );

  if (!confirmed) return;

  const updatedArticles = articles.map((article) =>
    article.id === id
      ? { ...article, status: "Published" }
      : article
  );

  setArticles(updatedArticles);

  localStorage.setItem(
    "lifesprout_articles",
    JSON.stringify(updatedArticles)
  );
};
  // Delete article.
const deleteArticle = (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this article?"
  );

  if (!confirmed) return;

  const updatedArticles = articles.filter(
    (article) => article.id !== id
  );

  setArticles(updatedArticles);

  localStorage.setItem(
    "lifesprout_articles",
    JSON.stringify(updatedArticles)
  );

  if (selectedArticle?.id === id) {
    setSelectedArticle(null);
  }
};

  // Navigate to Write Article page.
  const editArticle = (article) => {
    navigate("/write-article", {
      state: { article },
    });
  };

  const stats = [
    {
      title: "Total Articles",
      value: totalArticles,
      description: "All blog articles",
      icon: FileText,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Published",
      value: publishedArticles,
      description: "Live articles",
      icon: CheckCircle,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Drafts",
      value: draftArticles,
      description: "Work in progress",
      icon: FileEdit,
      color: "bg-orange-50 text-orange-600",
    },
    {
      title: "Scheduled",
      value: scheduledArticles,
      description: "Upcoming articles",
      icon: Clock,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-700";
      case "Draft":
        return "bg-orange-100 text-orange-700";
      case "Scheduled":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-w-0 space-y-6">

      {/* Page Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Articles
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage, publish and organize your health articles.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/write-article")}
          className="inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Write New Article
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
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

                <div className={`shrink-0 rounded-xl p-3 ${stat.color}`}>
                  <Icon size={21} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Articles Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

        {/* Filters */}
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-bold text-gray-800">
              All Articles
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View and manage your published and unpublished content.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-600 outline-none focus:border-blue-500 sm:w-36"
            >
              <option value="All">All Status</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Scheduled">Scheduled</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-600 outline-none focus:border-blue-500 sm:w-44"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "All" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">

            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Article</th>
                <th className="px-5 py-4 font-semibold">Category</th>
                <th className="px-5 py-4 font-semibold">Author</th>
                <th className="px-5 py-4 font-semibold">Publish Date</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {filteredArticles.map((article) => (
                <tr
                  key={article.id}
                  className="transition hover:bg-gray-50"
                >
                  {/* Article Details */}
                  <td className="px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <FileText size={20} />
                      </div>

                      <div className="min-w-0">
                        <p className="max-w-[250px] truncate font-semibold text-gray-800">
                          {article.title}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {article.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-5 py-4 text-gray-600">
                    {article.category}
                  </td>

                  {/* Author */}
                  <td className="px-5 py-4 text-gray-600">
                    {article.author}
                  </td>

                  {/* Date */}
                  <td className="px-5 py-4 whitespace-nowrap text-gray-600">
                    {formatDate(article.publishDate)}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        article.status
                      )}`}
                    >
                      {article.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">

                      <button
                        type="button"
                        onClick={() => setSelectedArticle(article)}
                        title="View Article"
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() => editArticle(article)}
                        title="Edit Article"
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-purple-50 hover:text-purple-600"
                      >
                        <Edit size={17} />
                      </button>

                      {article.status !== "Published" && (
                        <button
                          type="button"
                          onClick={() => publishArticle(article.id)}
                          title="Publish Article"
                          className="rounded-lg p-2 text-gray-500 transition hover:bg-green-50 hover:text-green-600"
                        >
                          <ArrowUpRight size={17} />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => deleteArticle(article.id)}
                        title="Delete Article"
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={17} />
                      </button>

                    </div>
                  </td>
                </tr>
              ))}

              {filteredArticles.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center"
                  >
                    <FileText
                      size={35}
                      className="mx-auto mb-3 text-gray-300"
                    />

                    <p className="font-semibold text-gray-600">
                      No articles found
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

        {/* Table Footer */}
        <div className="border-t border-gray-100 px-5 py-4">
          <p className="text-xs text-gray-500">
            Showing {filteredArticles.length} of {totalArticles} articles
          </p>
        </div>
      </div>

      {/* View Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Article Details
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  {selectedArticle.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">

              <div>
                <p className="text-xs font-medium text-gray-400">
                  ARTICLE TITLE
                </p>

                <h3 className="mt-1 text-lg font-semibold text-gray-800">
                  {selectedArticle.title}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-gray-400">
                    CATEGORY
                  </p>

                  <p className="mt-1 text-sm text-gray-700">
                    {selectedArticle.category}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-400">
                    AUTHOR
                  </p>

                  <p className="mt-1 text-sm text-gray-700">
                    {selectedArticle.author}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-400">
                    PUBLISH DATE
                  </p>

                  <p className="mt-1 text-sm text-gray-700">
                    {formatDate(selectedArticle.publishDate)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-400">
                    STATUS
                  </p>

                  <span
                    className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                      selectedArticle.status
                    )}`}
                  >
                    {selectedArticle.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-400">
                  DESCRIPTION
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                  {selectedArticle.description || "No description available."}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => editArticle(selectedArticle)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Edit size={16} />
                Edit Article
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Articles;
