
import { PenSquare, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

import StatCard from "../components/StatCard";
import ArticleList from "../components/ArticleList";
import ReviewQueue from "../components/ReviewQueue";

import {
  dashboardStats,
  recentArticles,
} from "../data/dashboardData";

const Dashboard = () => {
  const navigate = useNavigate();

  const pendingCount =
    dashboardStats.find((item) => item.type === "pending")?.value || 0;

  // Routes for each statistic card
  const statRoutes = {
    payment: "/payments",
    weekly: "/payments",
    monthly: "/payments",
    enquiries: "/enquiries",
    demo: "/demo-tracking",
    published: "/articles",
    pending: "/articles",
    visitors: "/analytics",
  };

  return (
    <div className="space-y-5">

      {/* Welcome banner */}
      <section className="rounded-2xl bg-gradient-to-r from-[#2470F9] to-[#35B7B4] p-6 text-white shadow-sm md:p-7">
        <h2 className="text-lg font-bold">
          Namaste, lifesproutcare 👋
        </h2>

        <p className="mt-2 text-sm text-white/90">
          Welcome to your Owner Dashboard. Manage your content,
          business, team and website performance.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => navigate("/write-article")}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-bold text-[#246BFA] transition hover:bg-blue-50"
          >
            <PenSquare size={15} />
            Write new article
          </button>

          <button
            onClick={() => navigate("/health-shorts")}
            className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-3 text-xs font-bold text-white transition hover:bg-white/30"
          >
            <Video size={15} />
            Add a short video
          </button>
        </div>
      </section>

      {/* Business statistics */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-[#0B1C3B]">
            Business overview
          </h2>

          <span className="text-xs text-[#8292B0]">
            Demo data
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((item) => (
            <button
              key={item.type}
              type="button"
              onClick={() => navigate(statRoutes[item.type])}
              className="w-full rounded-2xl text-left transition hover:-translate-y-1 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label={`View ${item.title}`}
            >
              <StatCard item={item} />
            </button>
          ))}
        </div>
      </section>

      {/* Articles and review queue */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <ArticleList articles={recentArticles} />

        <ReviewQueue pendingCount={Number(pendingCount)} />
      </section>

    </div>
  );
};

export default Dashboard;
