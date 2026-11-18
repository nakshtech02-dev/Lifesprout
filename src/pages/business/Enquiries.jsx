
import { useMemo, useState } from "react";
import usePersistentState from "../../hooks/usePersistentState";
import {
  Search,
  Users,
  UserPlus,
  CheckCircle2,
  XCircle,
  Phone,
  Eye,
  CalendarDays,
  MessageSquareText,
  Filter,
} from "lucide-react";

import { initialEnquiries } from "../../data/enquiryData";
import EnquiryDetailsModal from "../../components/EnquiryDetailsModal";

const statusStyles = {
  New: "bg-blue-50 text-blue-700",
  Called: "bg-amber-50 text-amber-700",
  Converted: "bg-emerald-50 text-emerald-700",
  Lost: "bg-red-50 text-red-700",
};

const Enquiries = () => {
  const [enquiries, setEnquiries] = usePersistentState(
  "lifesprout_enquiries",
  initialEnquiries
);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const stats = useMemo(() => [
    {
      title: "Total Enquiries",
      value: enquiries.length,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "New Enquiries",
      value: enquiries.filter((item) => item.status === "New").length,
      icon: UserPlus,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Converted",
      value: enquiries.filter((item) => item.status === "Converted").length,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Lost Leads",
      value: enquiries.filter((item) => item.status === "Lost").length,
      icon: XCircle,
      color: "bg-red-50 text-red-600",
    },
  ], [enquiries]);

  const filteredEnquiries = enquiries.filter((item) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      item.name.toLowerCase().includes(searchText) ||
      item.email.toLowerCase().includes(searchText) ||
      item.phone.includes(searchText) ||
      item.id.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const saveEnquiry = (updatedEnquiry) => {
    setEnquiries((prev) =>
      prev.map((item) =>
        item.id === updatedEnquiry.id ? updatedEnquiry : item
      )
    );

    setSelectedEnquiry(null);
  };

  const formatDate = (date) => {
    if (!date) return "Not scheduled";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Enquiries & Leads
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage customer enquiries, follow-ups and conversions.
          </p>
        </div>

        <div className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
          {enquiries.length} Total Records
        </div>
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-800">
                    {stat.value}
                  </h2>
                </div>

                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enquiry Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-bold text-slate-800">All Enquiries</h2>
            <p className="mt-1 text-xs text-gray-500">
              View and manage all customer leads.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search enquiries..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 sm:w-64"
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
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-8 text-sm outline-none focus:border-blue-500 sm:w-40"
              >
                <option value="All">All Status</option>
                <option value="New">New</option>
                <option value="Called">Called</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Service</th>
                <th className="px-5 py-4">Assigned To</th>
                <th className="px-5 py-4">Follow-up</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredEnquiries.map((item) => (
                <tr key={item.id} className="transition hover:bg-slate-50/70">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {item.email}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">{item.id}</p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-slate-700">
                      {item.service}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Via {item.source}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <Users size={15} />
                      </span>
                      {item.assignedTo}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CalendarDays size={15} className="text-gray-400" />
                      {formatDate(item.followUpDate)}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[item.status]}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <button
                      onClick={() => setSelectedEnquiry(item)}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Eye size={15} />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}

              {filteredEnquiries.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center">
                    <MessageSquareText
                      size={28}
                      className="mx-auto mb-2 text-gray-300"
                    />
                    <p className="font-medium text-slate-700">
                      No enquiries found
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                      Try changing your search or status filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100 px-5 py-4 text-xs text-gray-500">
          Showing {filteredEnquiries.length} of {enquiries.length} enquiries
        </div>
      </div>

      {/* Details Modal */}
      {selectedEnquiry && (
        <EnquiryDetailsModal
          enquiry={selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          onSave={saveEnquiry}
        />
      )}
    </div>
  );
};

export default Enquiries;
