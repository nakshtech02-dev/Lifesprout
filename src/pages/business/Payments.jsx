
import { useMemo, useState } from "react";
import usePersistentState from "../../hooks/usePersistentState";

import {
  IndianRupee,
  CheckCircle2,
  Clock3,
  RotateCcw,
  Search,
  Download,
  Eye,
  FileSpreadsheet,
  CalendarDays,
  CreditCard,
  ArrowUpRight,
  X,
} from "lucide-react";

import { initialPayments } from "../../data/paymentData";

import PaymentDetailsModal from "../../components/PaymentDetailsModal";

import {
  formatCurrency,
  exportPaymentsToExcel,
  downloadInvoice,
} from "../../utils/paymentUtils";

const Payments = () => {
  const [payments, setPayments] = usePersistentState(
  "lifesprout_payments",
  initialPayments
);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [refundPayment, setRefundPayment] = useState(null);

  // Statistics
  const totalRevenue = payments
    .filter((p) => p.status === "Success")
    .reduce((total, p) => total + p.amount, 0);

  const successfulPayments = payments.filter(
    (p) => p.status === "Success"
  ).length;

  const pendingPayments = payments.filter(
    (p) => p.status === "Pending"
  ).length;

  const refundedAmount = payments
    .filter((p) => p.status === "Refunded")
    .reduce((total, p) => total + p.amount, 0);

  // Date filtering
  const isWithinDateFilter = (date) => {
    if (dateFilter === "All") return true;

    const paymentDate = new Date(`${date}T00:00:00`);
    const today = new Date("2026-11-18T00:00:00");

    if (dateFilter === "Today") {
      return date === "2026-11-18";
    }

    if (dateFilter === "This Week") {
      const start = new Date(today);
      start.setDate(today.getDate() - 6);
      return paymentDate >= start && paymentDate <= today;
    }

    if (dateFilter === "This Month") {
      return (
        paymentDate.getMonth() === today.getMonth() &&
        paymentDate.getFullYear() === today.getFullYear()
      );
    }

    return true;
  };

  // Search and filters
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const query = search.toLowerCase();

      const matchesSearch =
        payment.customer.toLowerCase().includes(query) ||
        payment.email.toLowerCase().includes(query) ||
        payment.transactionId.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        payment.status === statusFilter;

      const matchesMethod =
        methodFilter === "All" ||
        payment.method === methodFilter;

      const matchesDate = isWithinDateFilter(payment.date);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesMethod &&
        matchesDate
      );
    });
  }, [payments, search, statusFilter, methodFilter, dateFilter]);

  // Refund request
  const handleRefund = () => {
    if (!refundPayment) return;

    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === refundPayment.id
          ? {
              ...payment,
              status: "Refund Pending",
              refundStatus: "Requested",
            }
          : payment
      )
    );

    setRefundPayment(null);
  };

  // Refund status label
  const getStatusStyle = (status) => {
    const styles = {
      Success: "bg-emerald-50 text-emerald-600",
      Pending: "bg-amber-50 text-amber-600",
      Failed: "bg-red-50 text-red-600",
      Refunded: "bg-purple-50 text-purple-600",
      "Refund Pending": "bg-orange-50 text-orange-600",
    };

    return styles[status] || "bg-gray-100 text-gray-600";
  };

  const statCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      subtitle: "Successful payments",
      icon: IndianRupee,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Successful Payments",
      value: successfulPayments,
      subtitle: "Completed transactions",
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Pending Payments",
      value: pendingPayments,
      subtitle: "Awaiting confirmation",
      icon: Clock3,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Refunded Amount",
      value: formatCurrency(refundedAmount),
      subtitle: "Successfully refunded",
      icon: RotateCcw,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="space-y-5">

      {/* Page Heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-[#0B1C3B]">
            Payments Management
          </h2>

          <p className="mt-1 text-sm text-[#8292B0]">
            Track transactions, manage refunds and download invoices.
          </p>
        </div>

        <button
          onClick={() => exportPaymentsToExcel(filteredPayments)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#246BFA] px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700"
        >
          <FileSpreadsheet size={16} />
          Export to Excel
        </button>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex items-center gap-4 rounded-2xl border border-[#DFE7F5] bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.color}`}
              >
                <Icon size={22} />
              </div>

              <div className="min-w-0">
                <h3 className="text-xl font-bold text-[#0B1C3B]">
                  {item.value}
                </h3>

                <p className="mt-1 text-xs font-semibold text-[#344563]">
                  {item.title}
                </p>

                <p className="mt-1 text-[10px] text-[#8292B0]">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Payments Table */}
      <section className="overflow-hidden rounded-2xl border border-[#DFE7F5] bg-white">

        {/* Table Header */}
        <div className="border-b border-[#E5EAF3] p-5">
          <div className="mb-4">
            <h3 className="text-base font-bold text-[#0B1C3B]">
              All Transactions
            </h3>

            <p className="mt-1 text-xs text-[#8292B0]">
              View and manage all customer payments.
            </p>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

            {/* Search */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8292B0]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transactions..."
                className="w-full rounded-xl border border-[#DFE7F5] py-3 pl-9 pr-3 text-xs outline-none focus:border-[#246BFA]"
              />
            </div>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-[#DFE7F5] bg-white px-3 py-3 text-xs text-[#344563] outline-none focus:border-[#246BFA]"
            >
              <option value="All">All Payment Status</option>
              <option value="Success">Success</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
              <option value="Refund Pending">Refund Pending</option>
            </select>

            {/* Method */}
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="rounded-xl border border-[#DFE7F5] bg-white px-3 py-3 text-xs text-[#344563] outline-none focus:border-[#246BFA]"
            >
              <option value="All">All Payment Methods</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Wallet">Wallet</option>
            </select>

            {/* Date */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="rounded-xl border border-[#DFE7F5] bg-white px-3 py-3 text-xs text-[#344563] outline-none focus:border-[#246BFA]"
            >
              <option value="All">All Dates</option>
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">

            <thead className="bg-[#F8FAFE]">
              <tr className="text-[10px] font-bold uppercase tracking-wider text-[#8292B0]">
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Transaction ID</th>
                <th className="px-5 py-4">Plan</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Method</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-[#E5EAF3] transition hover:bg-[#F8FAFE] last:border-0"
                >
                  {/* Customer */}
                  <td className="px-5 py-4">
                    <p className="text-xs font-bold text-[#0B1C3B]">
                      {payment.customer}
                    </p>

                    <p className="mt-1 text-[10px] text-[#8292B0]">
                      {payment.email}
                    </p>
                  </td>

                  {/* Transaction */}
                  <td className="px-5 py-4">
                    <span className="text-[10px] font-medium text-[#63728C]">
                      {payment.transactionId}
                    </span>
                  </td>

                  {/* Plan */}
                  <td className="px-5 py-4">
                    <span className="text-[11px] font-medium text-[#344563]">
                      {payment.plan}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-4">
                    <span className="text-xs font-bold text-[#0B1C3B]">
                      {formatCurrency(payment.amount)}
                    </span>
                  </td>

                  {/* Method */}
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-2 text-[11px] text-[#63728C]">
                      <CreditCard size={14} />
                      {payment.method}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-[11px] font-medium text-[#344563]">
                        {payment.date}
                      </p>

                      <p className="mt-1 text-[10px] text-[#8292B0]">
                        {payment.time}
                      </p>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1.5 text-[9px] font-bold ${getStatusStyle(payment.status)}`}
                    >
                      {payment.status}
                    </span>

                    {payment.refundStatus !== "Not Requested" && (
                      <p className="mt-1 text-[9px] text-[#8292B0]">
                        Refund: {payment.refundStatus}
                      </p>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">

                      <button
                        onClick={() => setSelectedPayment(payment)}
                        title="View details"
                        className="rounded-lg p-2 text-[#246BFA] transition hover:bg-blue-50"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() => downloadInvoice(payment)}
                        title="Download invoice"
                        className="rounded-lg p-2 text-[#079653] transition hover:bg-emerald-50"
                      >
                        <Download size={16} />
                      </button>

                      {payment.status === "Success" && (
                        <button
                          onClick={() => setRefundPayment(payment)}
                          title="Request refund"
                          className="rounded-lg p-2 text-orange-500 transition hover:bg-orange-50"
                        >
                          <RotateCcw size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-5 py-16 text-center">
                    <IndianRupee
                      size={30}
                      className="mx-auto mb-3 text-[#B0BDD1]"
                    />

                    <p className="text-sm font-bold text-[#344563]">
                      No payments found
                    </p>

                    <p className="mt-1 text-xs text-[#8292B0]">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E5EAF3] px-5 py-4">
          <p className="text-[11px] text-[#8292B0]">
            Showing {filteredPayments.length} of {payments.length} transactions
          </p>

          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
              setMethodFilter("All");
              setDateFilter("All");
            }}
            className="text-xs font-semibold text-[#246BFA] hover:underline"
          >
            Clear all filters
          </button>
        </div>
      </section>

      {/* Payment Details */}
      <PaymentDetailsModal
        payment={selectedPayment}
        onClose={() => setSelectedPayment(null)}
      />

      {/* Refund Confirmation */}
      {refundPayment && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-[#071A3B]/50 p-4 backdrop-blur-[2px]"
          onClick={() => setRefundPayment(null)}
        >
          <div
            className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-[#0B1C3B]">
                Request Refund
              </h3>

              <button
                onClick={() => setRefundPayment(null)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="rounded-xl bg-orange-50 p-4">
              <p className="text-xs font-medium text-orange-700">
                Refund amount
              </p>

              <h3 className="mt-2 text-2xl font-extrabold text-orange-600">
                {formatCurrency(refundPayment.amount)}
              </h3>

              <p className="mt-2 text-[11px] text-orange-700">
                Customer: {refundPayment.customer}
              </p>
            </div>

            <p className="my-4 text-xs leading-5 text-[#8292B0]">
              This demo will mark the refund as requested. It will not
              initiate an actual Razorpay refund.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setRefundPayment(null)}
                className="flex-1 rounded-xl border border-[#DFE7F5] py-3 text-xs font-bold text-[#344563]"
              >
                Cancel
              </button>

              <button
                onClick={handleRefund}
                className="flex-1 rounded-xl bg-orange-500 py-3 text-xs font-bold text-white transition hover:bg-orange-600"
              >
                Confirm Request
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Payments;
