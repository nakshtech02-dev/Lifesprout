
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Send,
  FileText,
  Image,
  CalendarDays,
  User,
  Tag,
  X,
  Eye,
} from "lucide-react";

import { initialContent } from "../../data/contentCalendarData";

const STORAGE_KEY = "lifesprout_articles";

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getSavedArticles = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Unable to read saved articles:", error);
  }

  return initialContent.filter((item) => item.type === "Blog");
};

const categories = [
  ...new Set(
    initialContent
      .filter((item) => item.type === "Blog")
      .map((item) => item.category)
      .filter(Boolean)
  ),
];

const authors = [
  ...new Set(
    initialContent
      .filter((item) => item.type === "Blog")
      .map((item) => item.author)
      .filter(Boolean)
  ),
];

const emptyArticle = {
  title: "",
  description: "",
  content: "",
  category: categories[0] || "",
  author: authors[0] || "Admin",
  publishDate: getTodayDate(),
  status: "Draft",
  featuredImage: "",
};

const WriteArticle = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const editingArticle = location.state?.article || null;

  const [formData, setFormData] = useState(emptyArticle);
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const isEditing = Boolean(editingArticle);

  useEffect(() => {
    if (editingArticle) {
      setFormData({
        ...emptyArticle,
        ...editingArticle,
        content:
          editingArticle.content || editingArticle.description || "",
        featuredImage: editingArticle.featuredImage || "",
      });
    } else {
      setFormData({
        ...emptyArticle,
        publishDate: getTodayDate(),
      });
    }

    setErrors({});
    setSaveMessage("");
  }, [editingArticle]);

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));

    setSaveMessage("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Please enter an article title.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Please enter an article description.";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Please write your article content.";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category.";
    }

    if (!formData.author.trim()) {
      newErrors.author = "Please enter an author name.";
    }

    if (!formData.publishDate) {
      newErrors.publishDate = "Please select a publish date.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const saveArticle = (status) => {
    if (!validateForm()) {
      return;
    }

    const savedArticles = getSavedArticles();

    const articleData = {
      ...formData,
      id: editingArticle?.id || `ART-${Date.now()}`,
      type: "Blog",
      status,
      title: formData.title.trim(),
      description: formData.description.trim(),
      content: formData.content.trim(),
      author: formData.author.trim(),
      updatedAt: new Date().toISOString(),
    };

    let updatedArticles;

    if (editingArticle) {
      const articleExists = savedArticles.some(
        (article) => article.id === editingArticle.id
      );

      if (articleExists) {
        updatedArticles = savedArticles.map((article) =>
          article.id === editingArticle.id
            ? articleData
            : article
        );
      } else {
        updatedArticles = [articleData, ...savedArticles];
      }
    } else {
      updatedArticles = [articleData, ...savedArticles];
    }

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedArticles)
      );

      setSaveMessage(
        status === "Published"
          ? "Article published successfully!"
          : status === "Scheduled"
          ? "Article scheduled successfully!"
          : "Article saved as draft!"
      );

      navigate("/articles");
    } catch (error) {
      console.error("Unable to save article:", error);
      setSaveMessage("Unable to save article. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveArticle(formData.status);
  };

  return (
    <div className="min-w-0 space-y-6">

      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <button
            type="button"
            onClick={() => navigate("/articles")}
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to Articles
          </button>

          <h1 className="text-2xl font-bold text-gray-800">
            {isEditing ? "Edit Article" : "Write Article"}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Create, edit and manage your health articles.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className="inline-flex w-fit items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
        >
          <Eye size={17} />
          Preview Article
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* Main Editor */}
          <div className="space-y-6 xl:col-span-2">

            {/* Article Information */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
                  <FileText size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-gray-800">
                    Article Information
                  </h2>
                  <p className="text-xs text-gray-500">
                    Enter the basic details of your article.
                  </p>
                </div>
              </div>

              {/* Title */}
              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Article Title <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="Enter your article title"
                  className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition focus:border-blue-500 ${
                    errors.title ? "border-red-400" : "border-gray-200"
                  }`}
                />

                {errors.title && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Short Description <span className="text-red-500">*</span>
                </label>

                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    updateField("description", e.target.value)
                  }
                  placeholder="Write a short summary of your article..."
                  className={`w-full resize-y rounded-lg border px-4 py-3 text-sm outline-none transition focus:border-blue-500 ${
                    errors.description ? "border-red-400" : "border-gray-200"
                  }`}
                />

                {errors.description && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>

            {/* Article Content */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-lg bg-purple-50 p-2.5 text-purple-600">
                  <FileText size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-gray-800">
                    Article Content
                  </h2>
                  <p className="text-xs text-gray-500">
                    Write the complete article here.
                  </p>
                </div>
              </div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Content <span className="text-red-500">*</span>
              </label>

              <textarea
                rows={18}
                value={formData.content}
                onChange={(e) => updateField("content", e.target.value)}
                placeholder={`Start writing your article here...

You can organize your article using:

Introduction

Main headings

Important information

Conclusion`}
                className={`w-full resize-y rounded-lg border px-4 py-3 text-sm leading-7 outline-none transition focus:border-blue-500 ${
                  errors.content ? "border-red-400" : "border-gray-200"
                }`}
              />

              <div className="mt-2 flex flex-wrap justify-between gap-2">
                {errors.content ? (
                  <p className="text-xs text-red-500">
                    {errors.content}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400">
                    Plain text editor for this frontend version.
                  </p>
                )}

                <p className="text-xs text-gray-400">
                  {formData.content.length} characters
                </p>
              </div>
            </div>

            {/* Featured Image */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-lg bg-orange-50 p-2.5 text-orange-600">
                  <Image size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-gray-800">
                    Featured Image
                  </h2>
                  <p className="text-xs text-gray-500">
                    Add an image URL for your article.
                  </p>
                </div>
              </div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Image URL
              </label>

              <input
                type="url"
                value={formData.featuredImage}
                onChange={(e) =>
                  updateField("featuredImage", e.target.value)
                }
                placeholder="https://example.com/article-image.jpg"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
              />

              {formData.featuredImage && (
                <div className="mt-4 overflow-hidden rounded-xl border border-gray-100">
                  <img
                    src={formData.featuredImage}
                    alt="Article preview"
                    className="h-52 w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">

            {/* Publishing Settings */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-lg bg-green-50 p-2.5 text-green-600">
                  <Send size={19} />
                </div>

                <h2 className="font-bold text-gray-800">
                  Publishing
                </h2>
              </div>

              {/* Status */}
              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Publishing Status
                </label>

                <select
                  value={formData.status}
                  onChange={(e) => updateField("status", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                >
                  <option value="Draft">Draft</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Published">Published</option>
                </select>
              </div>

              {/* Publish Date */}
              <div className="mb-5">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <CalendarDays size={16} />
                  Publish Date
                </label>

                <input
                  type="date"
                  value={formData.publishDate}
                  onChange={(e) =>
                    updateField("publishDate", e.target.value)
                  }
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-blue-500 ${
                    errors.publishDate ? "border-red-400" : "border-gray-200"
                  }`}
                />

                {errors.publishDate && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.publishDate}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="mb-5">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Tag size={16} />
                  Category
                </label>

                <select
                  value={formData.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                {errors.category && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.category}
                  </p>
                )}
              </div>

              {/* Author */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <User size={16} />
                  Author
                </label>

                <input
                  type="text"
                  list="article-authors"
                  value={formData.author}
                  onChange={(e) => updateField("author", e.target.value)}
                  placeholder="Enter author name"
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-blue-500 ${
                    errors.author ? "border-red-400" : "border-gray-200"
                  }`}
                />

                <datalist id="article-authors">
                  {authors.map((author) => (
                    <option key={author} value={author} />
                  ))}
                </datalist>

                {errors.author && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.author}
                  </p>
                )}
              </div>
            </div>

            {/* Save Actions */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-bold text-gray-800">
                Save Article
              </h2>

              <button
                type="button"
                onClick={() => saveArticle("Draft")}
                className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                <Save size={17} />
                Save as Draft
              </button>

              <button
                type="button"
                onClick={() => saveArticle("Scheduled")}
                className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                <CalendarDays size={17} />
                Schedule Article
              </button>

              <button
                type="button"
                onClick={() => saveArticle("Published")}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Send size={17} />
                Publish Article
              </button>

              {saveMessage && (
                <p className="mt-3 text-center text-xs text-orange-600">
                  {saveMessage}
                </p>
              )}

              <button
                type="button"
                onClick={() => navigate("/articles")}
                className="mt-3 w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-500 transition hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Article Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl">

            <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white p-5">
              <div>
                <h2 className="font-bold text-gray-800">
                  Article Preview
                </h2>
                <p className="text-xs text-gray-500">
                  Preview how your article content is arranged.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {formData.featuredImage && (
                <img
                  src={formData.featuredImage}
                  alt={formData.title || "Article featured image"}
                  className="mb-6 max-h-72 w-full rounded-xl object-cover"
                />
              )}

              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                {formData.category || "Category"}
              </span>

              <h1 className="mt-4 text-2xl font-bold text-gray-800 sm:text-3xl">
                {formData.title || "Your Article Title"}
              </h1>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                {formData.description || "Your article description will appear here."}
              </p>

              <div className="my-5 flex flex-wrap gap-4 border-b border-gray-100 pb-5 text-xs text-gray-500">
                <span>By {formData.author || "Author"}</span>
                <span>{formData.publishDate}</span>
              </div>

              <div className="whitespace-pre-wrap text-sm leading-8 text-gray-700">
                {formData.content || "Your article content will appear here."}
              </div>
            </div>

            <div className="border-t border-gray-100 p-5 text-right">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Back to Editor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WriteArticle;
