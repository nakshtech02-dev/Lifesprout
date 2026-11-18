
import {
  LayoutDashboard,
  FileText,
  PenSquare,
  Clapperboard,
  CalendarDays,
  IndianRupee,
  Inbox,
  BriefcaseBusiness,
  Video,
  Users,
  BookOpen,
  ShieldCheck,
  BarChart3,
  Settings,
  Activity,
  Database,
} from "lucide-react";

export const navigation = [
  {
    title: "OVERVIEW",
    items: [
      { name: "Dashboard", path: "/", icon: LayoutDashboard },
    ],
  },
  {
    title: "CONTENT",
    items: [
      { name: "Articles", path: "/articles", icon: FileText },
      { name: "Write article", path: "/write-article", icon: PenSquare },
      { name: "Health Shorts", path: "/health-shorts", icon: Clapperboard },
      { name: "Content Calendar", path: "/content-calendar", icon: CalendarDays },
    ],
  },
  {
    title: "BUSINESS",
    items: [
      { name: "Payments", path: "/payments", icon: IndianRupee },
      { name: "Enquiries", path: "/enquiries", icon: Inbox },
      { name: "CareTotal", path: "/caretotal", icon: BriefcaseBusiness },
      { name: "Free Demo", path: "/demo-tracking", icon: Video },
      { name: "Medical Tourism", path: "/medical-tourism", icon: Users },
      { name: "Pharma", path: "/pharma-products", icon: BookOpen },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      { name: "Admin Management", path: "/admin-management", icon: ShieldCheck },
      { name: "Team & Writers", path: "/writer-performance", icon: Users },
      { name: "UK Sales Partners", path: "/uk-sales-partners", icon: BriefcaseBusiness },
    ],
  },
  {
    title: "ANALYTICS & SECURITY",
    items: [
      { name: "Analytics", path: "/analytics", icon: BarChart3 },
      { name: "Ads & Settings", path: "/adsense-earnings", icon: Settings },
      { name: "Activity Logs", path: "/activity-log", icon: Activity },
      { name: "Backups", path: "/backups", icon: Database },
      { name: "Security", path: "/security", icon: ShieldCheck },
    ],
  },
];

export const dashboardStats = [
  {
    title: "Today's Payments",
    value: "₹24,500",
    subtitle: "+12.5% from yesterday",
    type: "payment",
  },
  {
    title: "Weekly Payments",
    value: "₹1,45,000",
    subtitle: "This week",
    type: "weekly",
  },
  {
    title: "Monthly Payments",
    value: "₹5,80,000",
    subtitle: "This month",
    type: "monthly",
  },
  {
    title: "New Enquiries",
    value: "12",
    subtitle: "4 today",
    type: "enquiries",
  },
  {
    title: "Free Demo Bookings",
    value: "8",
    subtitle: "3 today",
    type: "demo",
  },
  {
    title: "Published Articles",
    value: "126",
    subtitle: "6 this week",
    type: "published",
  },
  {
    title: "Pending Articles",
    value: "14",
    subtitle: "Needs review",
    type: "pending",
  },
  {
    title: "Website Visitors",
    value: "8,245",
    subtitle: "+18.6% this month",
    type: "visitors",
  },
];

export const recentArticles = [
  {
    title: "7 everyday habits that protect your heart",
    category: "Wellness",
    author: "Lifesprout Desk",
    date: "18 Nov 2026",
    status: "Published",
  },
  {
    title: "Vitamin D deficiency in India: why a sunny country is low on the sunshine vitamin",
    category: "Medical Journal",
    author: "Lifesprout Medical Desk",
    date: "17 Nov 2026",
    status: "Published",
  },
  {
    title: "Coming to India for treatment? Your complete medical visa checklist",
    category: "Medical Tourism",
    author: "Lifesprout Care Coordinator",
    date: "16 Nov 2026",
    status: "Published",
  },
  {
    title: "What GMP certification means and why it matters for your medicines",
    category: "Pharma",
    author: "Lifesprout Quality Team",
    date: "15 Nov 2026",
    status: "Published",
  },
  {
    title: "Teleconsultation is now part of everyday healthcare in small-town India",
    category: "Health News",
    author: "Lifesprout Desk",
    date: "14 Nov 2026",
    status: "Published",
  },
  {
    title: "Why every family needs one place for its health records",
    category: "Digital Health",
    author: "CareTotal Team",
    date: "13 Nov 2026",
    status: "Published",
  },
];
