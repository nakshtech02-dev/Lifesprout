
import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  FileText,
  CheckCircle,
  Clock,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Eye,
  Video,
} from "lucide-react";

import { initialContent } from "../../data/contentCalendarData";
import ContentModal from "../../components/ContentModal";

const ContentCalendar = () => {
  const [contents, setContents] = useState(initialContent);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  const today = new Date();
  const todayKey = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";

    return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const monthName = currentMonth.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  // Statistics
  const totalContent = contents.length;
  const publishedCount = contents.filter(
    (item) => item.status === "Published"
  ).length;
  const scheduledCount = contents.filter(
    (item) => item.status === "Scheduled"
  ).length;
  const draftCount = contents.filter(
    (item) => item.status === "Draft"
  ).length;

  const stats = [
    {
      title: "Total Content",
      value: totalContent,
      description: "All blogs and Shorts",
      icon: FileText,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Published",
      value: publishedCount,
      description: "Already published",
      icon: CheckCircle,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Scheduled",
      value: scheduledCount,
      description: "Upcoming content",
      icon: Clock,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Drafts",
      value: draftCount,
      description: "Waiting to be scheduled",
      icon: Pencil,
      color: "bg-orange-50 text-orange-600",
    },
  ];

  // Search and filters
  const filteredContents = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return contents.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search) ||
        item.author.toLowerCase().includes(search) ||
        item.category.toLowerCase().includes(search) ||
        item.id.toLowerCase().includes(search);

      const matchesType =
        typeFilter === "All" || item.type === typeFilter;

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [contents, searchTerm, typeFilter, statusFilter]);

  // Calendar date calculations
  const firstDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const calendarDays = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  const getDateKey = (day) => {
    return [
      currentMonth.getFullYear(),
      String(currentMonth.getMonth() + 1).padStart(2, "0"),
      String(day).padStart(2, "0"),
    ].join("-");
  };

  const getDayContents = (day) => {
    if (!day) return [];

    const dateKey = getDateKey(day);

    return contents.filter((item) => item.publishDate === dateKey);
  };

  const changeMonth = (direction) => {
    setCurrentMonth((prev) => {
      return new Date(
        prev.getFullYear(),
        prev.getMonth() + direction,
        1
      );
    });
  };

  const openAddModal = (date = "") => {
    setSelectedContent(null);
    setSelectedDate(date);
    setShowModal(true);
  };

  const openEditModal = (content) => {
    setSelectedContent(content);
    setSelectedDate(content.publishDate);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedContent(null);
    setSelectedDate("");
  };

  const handleSaveContent = (formData) => {
    if (selectedContent) {
      setContents((prev) =>
        prev.map((item) =>
          item.id === selectedContent.id
            ? { ...item, ...formData }
            : item
        )
      );
    } else {
      const newContent = {
        ...formData,
        id: `CNT-${Date.now()}`,
      };

      setContents((prev) => [newContent, ...prev]);
    }

    closeModal();
  };

  const getStatusStyle = (status) => {
    const styles = {
      Published: "bg-green-100 text-green-700",
      Scheduled: "bg-blue-100 text-blue-700",
      Draft: "bg-orange-100 text-orange-700",
    };

    return styles[status] || "bg-gray-100 text-gray-600";
  };

  const getTypeStyle = (type) => {
    return type === "Blog"
      ? "bg-purple-50 text-purple-700"
      : "bg-pink-50 text-pink-700";
  };

  return (
    <div className="space-y-6">

      {/* Page Heading */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Content Calendar
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Plan, organize and manage blogs and short-form content.
          </p>
        </div>

        <button
          onClick={() => openAddModal()}
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Content
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

      {/* Calendar */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-bold text-gray-800">
              Publishing Calendar
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Select a date to schedule new content.
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <button
              onClick={() => changeMonth(-1)}
              className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>

            <h3 className="min-w-36 text-center text-sm font-semibold text-gray-800">
              {monthName}
            </h3>

            <button
              onClick={() => changeMonth(1)}
              className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-gray-100 pb-3">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const dateKey = day ? getDateKey(day) : "";
            const dayContents = getDayContents(day);
            const isToday = dateKey === todayKey;

            return (
              <button
                key={`${dateKey || "empty"}-${index}`}
                type="button"
                disabled={!day}
                onClick={() => day && openAddModal(dateKey)}
                className={`min-h-24 border-b border-r border-gray-100 p-1.5 text-left transition hover:bg-blue-50 sm:min-h-32 sm:p-2 ${
                  !day ? "cursor-default bg-gray-50/50" : ""
                }`}
              >
                {day && (
                  <>
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                          isToday
                            ? "bg-blue-600 text-white"
                            : "text-gray-700"
                        }`}
                      >
                        {day}
                      </span>

                      {dayContents.length > 0 && (
                        <span className="text-[10px] text-gray-400">
                          {dayContents.length} item(s)
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      {dayContents.slice(0, 2).map((item) => (
                        <div
                          key={item.id}
                          title={item.title}
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(item);
                          }}
                          className={`truncate rounded px-1.5 py-1 text-[10px] font-medium sm:text-xs ${
                            item.type === "Blog"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-pink-100 text-pink-700"
                          }`}
                        >
                          {item.type === "Blog" ? "Blog: " : "Short: "}
                          {item.title}
                        </div>
                      ))}

                      {dayContents.length > 2 && (
                        <p className="px-1 text-[10px] text-gray-500">
                          +{dayContents.length - 2} more
                        </p>
                      )}
                    </div>
                  </>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm bg-purple-300" />
            Blog
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm bg-pink-300" />
            Short
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
            Today
          </div>
        </div>
      </div>

      {/* Content List */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-bold text-gray-800">
              All Content
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your blogs and Shorts.
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
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 sm:w-52"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Types</option>
              <option value="Blog">Blogs</option>
              <option value="Short">Shorts</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Published">Published</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Content</th>
                <th className="px-5 py-4 font-semibold">Author</th>
                <th className="px-5 py-4 font-semibold">Type</th>
                <th className="px-5 py-4 font-semibold">Category</th>
                <th className="px-5 py-4 font-semibold">Publish Date</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredContents.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`rounded-lg p-2 ${
                          item.type === "Blog"
                            ? "bg-purple-50 text-purple-600"
                            : "bg-pink-50 text-pink-600"
                        }`}
                      >
                        {item.type === "Blog" ? (
                          <FileText size={18} />
                        ) : (
                          <Video size={18} />
                        )}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-800">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {item.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {item.author}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getTypeStyle(
                        item.type
                      )}`}
                    >
                      {item.type}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {item.category || "—"}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {formatDate(item.publishDate)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => openEditModal(item)}
                      className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                    >
                      <Eye size={14} />
                      View / Edit
                    </button>
                  </td>
                </tr>
              ))}

              {filteredContents.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No content found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100 px-5 py-3 text-xs text-gray-500">
          Showing {filteredContents.length} of {contents.length} content items
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <ContentModal
          content={selectedContent}
          selectedDate={selectedDate}
          onClose={closeModal}
          onSave={handleSaveContent}
        />
      )}
    </div>
  );
};

export default ContentCalendar;
