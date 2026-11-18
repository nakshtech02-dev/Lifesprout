
import React from "react";
import { X, Eye, FileText, CheckCircle, Clock } from "lucide-react";

const WriterPerformanceModal = ({ writer, articles, onClose }) => {
  if (!writer) return null;

  const writerArticles = articles.filter(
    (article) => article.writerId === writer.id
  );

  const publishedArticles = writerArticles.filter(
    (article) => article.status === "Published"
  );

  const pendingArticles = writerArticles.filter(
    (article) => article.status === "Pending"
  );

  const formatViews = (views) => views.toLocaleString("en-IN");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Writer Performance
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Detailed writer information and article performance
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 p-6">

          {/* Writer Profile */}
          <div className="flex flex-col gap-4 rounded-xl bg-blue-50 p-5 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
              {writer.name.charAt(0)}
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800">
                {writer.name}
              </h3>
              <p className="text-sm text-gray-600">{writer.email}</p>
              <p className="text-sm text-gray-600">{writer.phone}</p>
            </div>

            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                writer.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {writer.status}
            </span>
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-xl border border-gray-100 p-4">
              <FileText className="mb-2 text-blue-600" size={20} />
              <p className="text-xl font-bold text-gray-800">
                {writer.articlesSubmitted}
              </p>
              <p className="text-xs text-gray-500">Submitted</p>
            </div>

            <div className="rounded-xl border border-gray-100 p-4">
              <CheckCircle className="mb-2 text-green-600" size={20} />
              <p className="text-xl font-bold text-gray-800">
                {writer.articlesPublished}
              </p>
              <p className="text-xs text-gray-500">Published</p>
            </div>

            <div className="rounded-xl border border-gray-100 p-4">
              <Clock className="mb-2 text-orange-500" size={20} />
              <p className="text-xl font-bold text-gray-800">
                {writer.articlesPending}
              </p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>

            <div className="rounded-xl border border-gray-100 p-4">
              <Eye className="mb-2 text-purple-600" size={20} />
              <p className="text-xl font-bold text-gray-800">
                {formatViews(writer.totalViews)}
              </p>
              <p className="text-xs text-gray-500">Total Views</p>
            </div>
          </div>

          {/* Target Progress */}
          <div className="rounded-xl border border-gray-100 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">
                Monthly Article Target
              </h3>
              <span className="text-sm font-semibold text-blue-600">
                {writer.articlesSubmitted} / {writer.target}
              </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-blue-600"
                style={{
                  width: `${Math.min(
                    (writer.articlesSubmitted / writer.target) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-3 font-semibold text-gray-800">
              Assigned Categories
            </h3>

            <div className="flex flex-wrap gap-2">
              {writer.categories.map((category) => (
                <span
                  key={category}
                  className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          {/* Articles */}
          <div>
            <h3 className="mb-3 font-semibold text-gray-800">
              Writer Articles
            </h3>

            {writerArticles.length === 0 ? (
              <p className="rounded-xl bg-gray-50 p-5 text-center text-sm text-gray-500">
                No articles found for this writer.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full min-w-[550px] text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Article</th>
                      <th className="px-4 py-3 font-semibold">Views</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {writerArticles.map((article) => (
                      <tr key={article.id}>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-800">
                            {article.title}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {article.category}
                          </p>
                        </td>

                        <td className="px-4 py-3 text-gray-600">
                          {formatViews(article.views)}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              article.status === "Published"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {article.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-400">
            Published articles: {publishedArticles.length} · Pending articles:{" "}
            {pendingArticles.length}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-gray-100 p-5">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WriterPerformanceModal;
