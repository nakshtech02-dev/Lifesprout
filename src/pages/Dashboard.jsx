
import { PenSquare, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

import StatCard from "../components/StatCard";
import ArticleList from "../components/ArticleList";
import ReviewQueue from "../components/ReviewQueue";

import { dashboardStats } from "../data/dashboardData";

import { initialPayments } from "../data/paymentData";
import { initialEnquiries } from "../data/enquiryData";
import { initialDemos } from "../data/demoData";
import { initialContent } from "../data/contentCalendarData";

import usePersistentState from "../hooks/usePersistentState";

// Get today's date in YYYY-MM-DD format
const getToday = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// Format Indian currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format numbers
const formatNumber = (number) => {
  return new Intl.NumberFormat("en-IN").format(number);
};

const Dashboard = () => {
  const navigate = useNavigate();

  // =====================================
  // 1. GET SAVED DATA
  // =====================================

  const [payments] = usePersistentState(
    "lifesprout_payments",
    initialPayments
  );

  const [enquiries] = usePersistentState(
    "lifesprout_enquiries",
    initialEnquiries
  );

  const [demos] = usePersistentState(
    "lifesprout_demos",
    initialDemos
  );

  const [articles] = usePersistentState(
    "lifesprout_articles",
    initialContent.filter((item) => item.type === "Blog")
  );

  // =====================================
  // 2. PAYMENT CALCULATIONS
  // =====================================

  const today = getToday();

  const todayDate = new Date(`${today}T00:00:00`);

  // Calculate last 7 days
  const weekStart = new Date(todayDate);
  weekStart.setDate(todayDate.getDate() - 6);

  const weekStartString = [
    weekStart.getFullYear(),
    String(weekStart.getMonth() + 1).padStart(2, "0"),
    String(weekStart.getDate()).padStart(2, "0"),
  ].join("-");

  // Only successful payments count as revenue
  const successfulPayments = payments.filter(
    (payment) => payment.status === "Success"
  );

  // Calculate revenue between two dates
  const getRevenue = (startDate, endDate) => {
    return successfulPayments
      .filter(
        (payment) =>
          payment.date >= startDate &&
          payment.date <= endDate
      )
      .reduce(
        (total, payment) => total + Number(payment.amount || 0),
        0
      );
  };

  // Today's revenue
  const todayRevenue = getRevenue(today, today);

  // Weekly revenue
  const weeklyRevenue = getRevenue(
    weekStartString,
    today
  );

  // Monthly revenue
  const monthlyStart = `${today.slice(0, 7)}-01`;

  const monthlyRevenue = getRevenue(
    monthlyStart,
    today
  );

  // =====================================
  // 3. ENQUIRIES CALCULATION
  // =====================================

  const newEnquiries = enquiries.filter(
    (item) => item.status === "New"
  ).length;

  // =====================================
  // 4. FREE DEMOS CALCULATION
  // =====================================

  const totalDemos = demos.length;

  // =====================================
  // 5. ARTICLES CALCULATIONS
  // =====================================

  const publishedArticles = articles.filter(
    (article) => article.status === "Published"
  ).length;

  const pendingArticles = articles.filter(
    (article) => article.status === "Draft"
  ).length;

  // Get latest 6 published articles
  const dashboardRecentArticles = [...articles]
    .filter(
      (article) => article.status === "Published"
    )
    .sort(
      (a, b) =>
        new Date(b.publishDate || 0) -
        new Date(a.publishDate || 0)
    )
    .slice(0, 6)
    .map((article) => ({
      ...article,
      date: article.publishDate,
    }));

  // =====================================
  // 6. WEBSITE VISITORS
  // =====================================

  // Currently using demo Analytics data
  const demoVisitors =
    dashboardStats.find(
      (item) => item.type === "visitors"
    )?.value || "0";

  // =====================================
  // 7. DASHBOARD STATISTICS
  // =====================================

  const actualDashboardStats = [
    {
      type: "payment",
      title: "Today's Payments",
      value: formatCurrency(todayRevenue),
      subtitle: "Successful payments today",
    },
    {
      type: "weekly",
      title: "Weekly Payments",
      value: formatCurrency(weeklyRevenue),
      subtitle: "Last 7 days",
    },
    {
      type: "monthly",
      title: "Monthly Payments",
      value: formatCurrency(monthlyRevenue),
      subtitle: "This month",
    },
    {
      type: "enquiries",
      title: "New Enquiries",
      value: formatNumber(newEnquiries),
      subtitle: "Currently new",
    },
    {
      type: "demo",
      title: "Free Demo Bookings",
      value: formatNumber(totalDemos),
      subtitle: "Total demo records",
    },
    {
      type: "published",
      title: "Published Articles",
      value: formatNumber(publishedArticles),
      subtitle: "Published articles",
    },
    {
      type: "pending",
      title: "Pending Articles",
      value: formatNumber(pendingArticles),
      subtitle: "Draft articles",
    },
    {
      type: "visitors",
      title: "Website Visitors",
      value: demoVisitors,
      subtitle: "Demo analytics data",
    },
  ];

  // =====================================
  // 8. STAT CARD NAVIGATION
  // =====================================

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

  // =====================================
  // 9. DASHBOARD UI
  // =====================================

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
            Saved demo records
          </span>

        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

          {actualDashboardStats.map((item) => (
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

      {/* Recent articles and review queue */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">

        <ArticleList
          articles={dashboardRecentArticles}
        />

        <ReviewQueue
          pendingCount={pendingArticles}
        />

      </section>

    </div>
  );
};

export default Dashboard;
