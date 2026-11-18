
import React, { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Video,
  Eye,
  Edit,
  Trash2,
  X,
  Calendar,
  User,
  Tag,
  Play,
  Clock,
  CheckCircle,
  FileText,
  ExternalLink,
} from "lucide-react";
import { initialContent } from "../../data/contentCalendarData";

const STORAGE_KEY = "lifesprout_health_shorts";

const getSavedShorts = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Unable to load health shorts:", error);
  }

  return initialContent.filter((item) => item.type === "Short");
};

const categories = [
  "General Health",
  "Fitness",
  "Nutrition",
  "Mental Health",
  "Healthy Lifestyle",
  "Preventive Care",
];

const emptyForm = {
  title: "",
  description: "",
  category: "General Health",
  author: "",
  publishDate: "",
  status: "Draft",
  thumbnail: "",
  videoUrl: "",
};

const HealthShorts = () => {
  const [shorts, setShorts] = useState(getSavedShorts);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShort, setSelectedShort] = useState(null);
  const [viewShort, setViewShort] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const saveShorts = (updatedShorts) => {
    setShorts(updatedShorts);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedShorts));
    } catch (error) {
      console.error("Unable to save health shorts:", error);
      alert("Unable to save changes in this browser.");
    }
  };

  const stats = useMemo(
    () => [
      {
        title: "Total Shorts",
        value: shorts.length,
        icon: Video,
        color: "blue",
      },
      {
        title: "Published",
        value: shorts.filter((item) => item.status === "Published").length,
        icon: CheckCircle,
        color: "green",
      },
      {
        title: "Drafts",
        value: shorts.filter((item) => item.status === "Draft").length,
        icon: FileText,
        color: "orange",
      },
      {
        title: "Scheduled",
        value: shorts.filter((item) => item.status === "Scheduled").length,
        icon: Clock,
        color: "purple",
      },
    ],
    [shorts]
  );

  const filteredShorts = useMemo(() => {
    return shorts.filter((short) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        short.title?.toLowerCase().includes(search) ||
        short.author?.toLowerCase().includes(search) ||
        short.category?.toLowerCase().includes(search) ||
        short.id?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" || short.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All" || short.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [shorts, searchTerm, statusFilter, categoryFilter]);

  const openAddModal = () => {
    setSelectedShort(null);
    setFormData(emptyForm);
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (short) => {
    setSelectedShort(short);
    setFormData({
      title: short.title || "",
      description: short.description || "",
      category: short.category || "General Health",
      author: short.author || "",
      publishDate: short.publishDate || "",
      status: short.status || "Draft",
      thumbnail: short.thumbnail || "",
      videoUrl: short.videoUrl || "",
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedShort(null);
    setFormData(emptyForm);
    setErrors({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Video title is required.";
    if (!formData.description.trim())
      newErrors.description = "Description is required.";
    if (!formData.author.trim()) newErrors.author = "Author is required.";
    if (!formData.publishDate)
      newErrors.publishDate = "Publish date is required.";

    if (
      formData.videoUrl.trim() &&
      !/^https?:\/\/.+/i.test(formData.videoUrl.trim())
    ) {
      newErrors.videoUrl = "Enter a valid URL starting with http:// or https://.";
    }

    if (
      formData.thumbnail.trim() &&
      !/^https?:\/\/.+/i.test(formData.thumbnail.trim())
    ) {
      newErrors.thumbnail =
        "Enter a valid image URL starting with http:// or https://.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    if (selectedShort) {
      const updatedShorts = shorts.map((short) =>
        short.id === selectedShort.id
          ? {
              ...short,
              ...formData,
              type: "Short",
              updatedAt: new Date().toISOString(),
            }
          : short
      );

      saveShorts(updatedShorts);
    } else {
      const newShort = {
        ...formData,
        id: `SH-${Date.now()}`,
        type: "Short",
        createdAt: new Date().toISOString(),
      };

      saveShorts([newShort, ...shorts]);
    }

    closeModal();
  };

  const handleDelete = (short) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${short.title}"?`
    );

    if (!confirmed) return;

    saveShorts(shorts.filter((item) => item.id !== short.id));

    if (viewShort?.id === short.id) {
      setViewShort(null);
    }
  };

  const handlePublish = (short) => {
    const updatedShorts = shorts.map((item) =>
      item.id === short.id
        ? { ...item, status: "Published" }
        : item
    );

    saveShorts(updatedShorts);
  };

  const statusStyle = (status) => {
    const styles = {
      Published: "bg-green-50 text-green-700",
      Draft: "bg-orange-50 text-orange-700",
      Scheduled: "bg-purple-50 text-purple-700",
    };

    return styles[status] || "bg-gray-100 text-gray-600";
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="min-h-screen space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <span>Content Management</span>
            <span>/</span>
            <span className="text-blue-600">Health Shorts</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-800">
            Health Shorts
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your short health videos and their publishing schedule.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Health Short
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          const colorStyles = {
            blue: "bg-blue-50 text-blue-600",
            green: "bg-green-50 text-green-600",
            orange: "bg-orange-50 text-orange-600",
            purple: "bg-purple-50 text-purple-600",
          };

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-800">
                    {stat.value}
                  </h2>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorStyles[stat.color]}`}
                >
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search shorts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={inputClass}
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Scheduled">Scheduled</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={inputClass}
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Shorts Grid */}
      {filteredShorts.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredShorts.map((short) => (
            <div
              key={short.id}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {/* Thumbnail */}
              <div className="relative h-48 bg-gray-100">
                {short.thumbnail ? (
                  <img
                    src={short.thumbnail}
                    alt={short.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                    <Video size={48} className="text-blue-400" />
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-blue-600 shadow">
                    <Play size={21} fill="currentColor" />
                  </div>
                </div>

                <span
                  className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(short.status)}`}
                >
                  {short.status}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-5">
                <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">
                  <span className="rounded-md bg-blue-50 px-2 py-1 font-medium text-blue-600">
                    {short.category || "General Health"}
                  </span>
                  <span>•</span>
                  <span>{short.id}</span>
                </div>

                <h3 className="line-clamp-2 min-h-12 text-base font-bold text-gray-800">
                  {short.title}
                </h3>

                <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-6 text-gray-500">
                  {short.description}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <User size={14} />
                    {short.author || "Unknown"}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {short.publishDate || "No date"}
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setViewShort(short)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                  >
                    <Eye size={16} />
                    View
                  </button>

                  <div className="flex items-center gap-1">
                    {short.status !== "Published" && (
                      <button
                        onClick={() => handlePublish(short)}
                        title="Publish"
                        className="rounded-lg p-2 text-green-600 transition hover:bg-green-50"
                      >
                        <CheckCircle size={17} />
                      </button>
                    )}

                    <button
                      onClick={() => openEditModal(short)}
                      title="Edit"
                      className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100"
                    >
                      <Edit size={17} />
                    </button>

                    <button
                      onClick={() => handleDelete(short)}
                      title="Delete"
                      className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white px-5 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
            <Video size={30} />
          </div>

          <h3 className="mt-4 text-lg font-semibold text-gray-800">
            No health shorts found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Try changing your filters or add a new health short.
          </p>

          <button
            onClick={openAddModal}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Add Health Short
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {selectedShort ? "Edit Health Short" : "Add Health Short"}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Enter the details of your health video.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Video Title *
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter video title"
                  className={inputClass}
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-500">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Write a short description..."
                  className={inputClass}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Author *
                  </label>
                  <input
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Enter author name"
                    className={inputClass}
                  />
                  {errors.author && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.author}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Publish Date *
                  </label>
                  <input
                    type="date"
                    name="publishDate"
                    value={formData.publishDate}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  {errors.publishDate && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.publishDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Thumbnail Image URL
                </label>
                <input
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  placeholder="https://example.com/thumbnail.jpg"
                  className={inputClass}
                />
                {errors.thumbnail && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.thumbnail}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Video URL
                </label>
                <input
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  placeholder="https://youtube.com/..."
                  className={inputClass}
                />
                {errors.videoUrl && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.videoUrl}
                  </p>
                )}
              </div>

              <div className="flex flex-col-reverse justify-end gap-3 border-t border-gray-100 pt-5 sm:flex-row">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {selectedShort ? "Update Short" : "Save Short"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewShort && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <h2 className="text-lg font-bold text-gray-800">
                Health Short Details
              </h2>

              <button
                onClick={() => setViewShort(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {viewShort.thumbnail ? (
              <img
                src={viewShort.thumbnail}
                alt={viewShort.title}
                className="h-56 w-full bg-gray-100 object-cover"
              />
            ) : (
              <div className="flex h-48 items-center justify-center bg-blue-50 text-blue-400">
                <Video size={48} />
              </div>
            )}

            <div className="space-y-4 p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(viewShort.status)}`}
                >
                  {viewShort.status}
                </span>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                  {viewShort.category}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-800">
                {viewShort.title}
              </h3>

              <p className="text-sm leading-7 text-gray-600">
                {viewShort.description}
              </p>

              <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Author</p>
                  <p className="mt-1 font-semibold text-gray-800">
                    {viewShort.author || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Publish Date</p>
                  <p className="mt-1 font-semibold text-gray-800">
                    {viewShort.publishDate || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Short ID</p>
                  <p className="mt-1 font-semibold text-gray-800">
                    {viewShort.id}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Content Type</p>
                  <p className="mt-1 font-semibold text-gray-800">Health Short</p>
                </div>
              </div>

              {viewShort.videoUrl && (
                <a
                  href={viewShort.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <ExternalLink size={16} />
                  Open Video Link
                </a>
              )}

              <button
                onClick={() => {
                  setViewShort(null);
                  openEditModal(viewShort);
                }}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Edit Health Short
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthShorts;
