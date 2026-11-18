
import { useMemo, useState } from "react";
import {
  Search,
  Users,
  UserCheck,
  Clock,
  AlertCircle,
  Eye,
  CalendarDays,
  RefreshCw,
  ShieldCheck,
  X,
} from "lucide-react";

import { initialCareTotalCustomers } from "../../data/careTotalData";
import CareTotalDetailsModal from "../../components/CareTotalDetailsModal";

const CareTotal = () => {
  const [customers, setCustomers] = useState(initialCareTotalCustomers);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [notice, setNotice] = useState("");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysRemaining = (expiryDate) => {
    const expiry = new Date(`${expiryDate}T00:00:00`);
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  };

  const getEffectiveStatus = (customer) => {
    if (customer.status !== "Active") return customer.status;

    return getDaysRemaining(customer.expiryDate) < 0
      ? "Expired"
      : "Active";
  };

  const expiringCustomers = customers.filter((customer) => {
    return (
      getEffectiveStatus(customer) === "Active" &&
      getDaysRemaining(customer.expiryDate) >= 0 &&
      getDaysRemaining(customer.expiryDate) <= 7
    );
  });

  const stats = [
    {
      title: "Total Customers",
      value: customers.length,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Active Subscriptions",
      value: customers.filter(
        (customer) => getEffectiveStatus(customer) === "Active"
      ).length,
      icon: UserCheck,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Expiring Soon",
      value: expiringCustomers.length,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Expired Plans",
      value: customers.filter(
        (customer) => getEffectiveStatus(customer) === "Expired"
      ).length,
      icon: AlertCircle,
      color: "bg-red-50 text-red-600",
    },
  ];

  const filteredCustomers = useMemo(() => {
    const searchText = search.toLowerCase();

    return customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchText) ||
        customer.email.toLowerCase().includes(searchText) ||
        customer.phone.includes(searchText) ||
        customer.id.toLowerCase().includes(searchText);

      const matchesPlan =
        planFilter === "All" || customer.plan === planFilter;

      const actualStatus =
        customer.status === "Active" &&
        new Date(`${customer.expiryDate}T00:00:00`) < today
          ? "Expired"
          : customer.status;

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Expiring Soon"
          ? actualStatus === "Active" &&
            getDaysRemaining(customer.expiryDate) >= 0 &&
            getDaysRemaining(customer.expiryDate) <= 7
          : actualStatus === statusFilter);

      return matchesSearch && matchesPlan && matchesStatus;
    });
  }, [customers, search, planFilter, statusFilter]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (date) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const saveCustomer = (updatedCustomer) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer
      )
    );

    setSelectedCustomer(null);
    setNotice("Customer subscription updated successfully.");
  };

  const renewCustomer = (customer) => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const expiry = new Date(start);
    expiry.setDate(expiry.getDate() + 30);

    const formatISODate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const updatedCustomer = {
      ...customer,
      status: "Active",
      startDate: formatISODate(start),
      expiryDate: formatISODate(expiry),
    };

    setCustomers((prev) =>
      prev.map((item) =>
        item.id === customer.id ? updatedCustomer : item
      )
    );

    setSelectedCustomer(null);
    setNotice(`${customer.name}'s plan has been renewed for 30 days.`);
  };

  const statusStyles = {
    Active: "bg-emerald-50 text-emerald-700",
    Expired: "bg-red-50 text-red-700",
    Cancelled: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            CareTotal Customers
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage subscriptions, plans and customer renewals.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
          <ShieldCheck size={17} />
          Subscription Management
        </div>
      </div>

      {/* Success Notice */}
      {notice && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <p>{notice}</p>
          <button onClick={() => setNotice("")} aria-label="Close notice">
            <X size={17} />
          </button>
        </div>
      )}

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

      {/* Renewal Reminders */}
      <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-5">
        <div className="mb-4 flex items-center gap-2">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
            <CalendarDays size={19} />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">Renewal Reminders</h2>
            <p className="text-xs text-gray-500">
              Customers whose subscriptions expire within 7 days.
            </p>
          </div>
        </div>

        {expiringCustomers.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {expiringCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {customer.name}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {customer.plan} Plan · Expires {formatDate(customer.expiryDate)}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-amber-700">
                    {getDaysRemaining(customer.expiryDate) === 0
                      ? "Expires today"
                      : `${getDaysRemaining(customer.expiryDate)} days left`}
                  </p>
                </div>

                <button
                  onClick={() => renewCustomer(customer)}
                  className="shrink-0 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                >
                  Renew
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No subscriptions are expiring within the next 7 days.
          </p>
        )}
      </div>

      {/* Customer Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5">
          <div>
            <h2 className="font-bold text-slate-800">All Customers</h2>
            <p className="mt-1 text-xs text-gray-500">
              View customer plans and subscription details.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customers..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Plans</option>
              <option value="Basic">Basic</option>
              <option value="Premium">Premium</option>
              <option value="Family">Family</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Expiring Soon">Expiring Soon</option>
              <option value="Expired">Expired</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Plan</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Start Date</th>
                <th className="px-5 py-4">Expiry Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((customer) => {
                const status = getEffectiveStatus(customer);

                return (
                  <tr
                    key={customer.id}
                    className="transition hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">
                        {customer.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {customer.email}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {customer.id}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                        {customer.plan}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                      {formatCurrency(customer.amount)}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-500">
                      {formatDate(customer.startDate)}
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-600">
                        {formatDate(customer.expiryDate)}
                      </p>
                      {status === "Active" &&
                        getDaysRemaining(customer.expiryDate) <= 7 && (
                          <p className="mt-1 text-xs font-medium text-amber-600">
                            {getDaysRemaining(customer.expiryDate) === 0
                              ? "Expires today"
                              : `${getDaysRemaining(customer.expiryDate)} days left`}
                          </p>
                        )}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[status] || statusStyles.Cancelled}`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye size={15} />
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center">
                    <Users
                      size={28}
                      className="mx-auto mb-2 text-gray-300"
                    />
                    <p className="font-medium text-slate-700">
                      No customers found
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

        <div className="border-t border-gray-100 px-5 py-4 text-xs text-gray-500">
          Showing {filteredCustomers.length} of {customers.length} customers
        </div>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <CareTotalDetailsModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onSave={saveCustomer}
          onRenew={renewCustomer}
        />
      )}
    </div>
  );
};

export default CareTotal;
