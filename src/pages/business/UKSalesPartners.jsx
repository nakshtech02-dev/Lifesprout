import { useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  TrendingUp,
  Wallet,
  Search,
  Eye,
  MapPin,
  ArrowUpRight,
  HandCoins,
} from "lucide-react";

import {
  initialPartners,
  formatGBP,
} from "../../data/partnerData";

import PartnerDetailsModal from "../../components/PartnerDetailsModal";

const UKSalesPartners = () => {
  const [partners, setPartners] = useState(initialPartners);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [payoutFilter, setPayoutFilter] = useState("All");

  // Calculate commission for each partner
  const getCommission = (partner) =>
    Math.round(
      partner.monthlySales * (partner.commissionRate / 100)
    );

  // Dashboard statistics
  const totalPartners = partners.length;

  const activePartners = partners.filter(
    (partner) => partner.status === "Active"
  ).length;

  const totalMonthlySales = partners.reduce(
    (total, partner) => total + partner.monthlySales,
    0
  );

  const pendingPayouts = partners
    .filter((partner) => partner.payoutStatus === "Pending")
    .reduce(
      (total, partner) => total + getCommission(partner),
      0
    );

  const totalCommission = partners.reduce(
    (total, partner) => total + getCommission(partner),
    0
  );

  // Search and filters
  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        partner.name.toLowerCase().includes(search) ||
        partner.email.toLowerCase().includes(search) ||
        partner.id.toLowerCase().includes(search) ||
        partner.region.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        partner.status === statusFilter;

      const matchesPayout =
        payoutFilter === "All" ||
        partner.payoutStatus === payoutFilter;

      return matchesSearch && matchesStatus && matchesPayout;
    });
  }, [partners, searchTerm, statusFilter, payoutFilter]);

  // Save edited partner
  const handleSavePartner = (updatedPartner) => {
    setPartners((prev) =>
      prev.map((partner) =>
        partner.id === updatedPartner.id
          ? updatedPartner
          : partner
      )
    );

    setSelectedPartner(updatedPartner);
  };

  // Mark payout as paid
  const handleMarkPaid = (partnerId) => {
    setPartners((prev) =>
      prev.map((partner) =>
        partner.id === partnerId
          ? { ...partner, payoutStatus: "Paid" }
          : partner
      )
    );

    setSelectedPartner((prev) =>
      prev && prev.id === partnerId
        ? { ...prev, payoutStatus: "Paid" }
        : prev
    );
  };

  const stats = [
    {
      title: "Total Partners",
      value: totalPartners,
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      description: "Registered sales partners",
    },
    {
      title: "Active Partners",
      value: activePartners,
      icon: UserCheck,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      description: "Currently active",
    },
    {
      title: "Monthly Sales",
      value: formatGBP(totalMonthlySales),
      icon: TrendingUp,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      description: "November 2026 sales",
    },
    {
      title: "Pending Payouts",
      value: formatGBP(pendingPayouts),
      icon: Wallet,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      description: "Commission awaiting payment",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            UK Sales Partners
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage sales partners, track monthly performance and payouts.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600">
          <HandCoins size={17} className="text-blue-600" />
          November 2026
        </div>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-slate-800">
                    {stat.value}
                  </h2>
                </div>

                <div className={`rounded-xl p-3 ${stat.iconBg}`}>
                  <Icon size={21} className={stat.iconColor} />
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-400">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Commission overview */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm text-slate-500">
              Total Commission Earned
            </p>
            <h3 className="mt-2 text-2xl font-bold text-slate-800">
              {formatGBP(totalCommission)}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Across all partners this month
            </p>
          </div>

          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
            <ArrowUpRight size={24} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm text-slate-500">
              Completed Payouts
            </p>
            <h3 className="mt-2 text-2xl font-bold text-emerald-600">
              {formatGBP(totalCommission - pendingPayouts)}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Commission already marked as paid
            </p>
          </div>

          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
            <Wallet size={24} />
          </div>
        </div>
      </div>

      {/* Partner table */}
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        {/* Table heading */}
        <div className="border-b border-slate-100 p-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="font-bold text-slate-800">
                Sales Partner Records
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                View partner sales and commission details.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Search */}
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search partner..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 sm:w-56"
                />
              </div>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-500"
              >
                <option value="All">All Partners</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              {/* Payout filter */}
              <select
                value={payoutFilter}
                onChange={(e) => setPayoutFilter(e.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-500"
              >
                <option value="All">All Payouts</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>
        </div>

        {/* Responsive table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4">Partner</th>
                <th className="px-5 py-4">Region</th>
                <th className="px-5 py-4">Monthly Sales</th>
                <th className="px-5 py-4">Commission</th>
                <th className="px-5 py-4">Earned</th>
                <th className="px-5 py-4">Payout Status</th>
                <th className="px-5 py-4">Partner Status</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredPartners.map((partner) => (
                <tr
                  key={partner.id}
                  className="text-sm transition hover:bg-slate-50/70"
                >
                  {/* Partner details */}
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-800">
                      {partner.name}
                    </div>
                    <div className="mt-1 text-xs text-slate-400">
                      {partner.email}
                    </div>
                    <div className="mt-1 text-xs text-slate-400">
                      {partner.id}
                    </div>
                  </td>

                  {/* Region */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <MapPin size={14} className="text-slate-400" />
                      {partner.region}
                    </div>
                  </td>

                  {/* Sales */}
                  <td className="px-5 py-4 font-medium text-slate-700">
                    {formatGBP(partner.monthlySales)}
                  </td>

                  {/* Commission rate */}
                  <td className="px-5 py-4 text-slate-600">
                    {partner.commissionRate}%
                  </td>

                  {/* Commission earned */}
                  <td className="px-5 py-4 font-semibold text-slate-800">
                    {formatGBP(getCommission(partner))}
                  </td>

                  {/* Payout status */}
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        partner.payoutStatus === "Paid"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-orange-50 text-orange-700"
                      }`}
                    >
                      {partner.payoutStatus}
                    </span>
                  </td>

                  {/* Partner status */}
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        partner.status === "Active"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {partner.status}
                    </span>
                  </td>

                  {/* View button */}
                  <td className="px-5 py-4">
                    <button
                      onClick={() => setSelectedPartner(partner)}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Eye size={15} />
                      Details
                    </button>
                  </td>
                </tr>
              ))}

              {filteredPartners.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-12 text-center text-sm text-slate-400"
                  >
                    No sales partners found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="border-t border-slate-100 px-5 py-4">
          <p className="text-xs text-slate-500">
            Showing {filteredPartners.length} of {partners.length} partners
          </p>
        </div>
      </div>

      {/* Partner details modal */}
      {selectedPartner && (
        <PartnerDetailsModal
          partner={selectedPartner}
          onClose={() => setSelectedPartner(null)}
          onSave={handleSavePartner}
          onMarkPaid={handleMarkPaid}
        />
      )}
    </div>
  );
};

export default UKSalesPartners;