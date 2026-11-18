
import { X, Download, Receipt, CreditCard } from "lucide-react";
import {
  formatCurrency,
  downloadInvoice,
} from "../utils/paymentUtils";

const PaymentDetailsModal = ({
  payment,
  onClose,
}) => {
  if (!payment) return null;

  const details = [
    ["Transaction ID", payment.transactionId],
    ["Customer Name", payment.customer],
    ["Email Address", payment.email],
    ["Plan / Service", payment.plan],
    ["Payment Method", payment.method],
    ["Payment Date", payment.date],
    ["Payment Time", payment.time],
    ["Payment Status", payment.status],
    ["Refund Status", payment.refundStatus],
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071A3B]/50 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-[550px] overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5EAF3] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Receipt size={21} />
            </div>

            <div>
              <h2 className="text-base font-bold text-[#0B1C3B]">
                Payment Details
              </h2>
              <p className="mt-1 text-[11px] text-[#8292B0]">
                Invoice INV-{payment.id}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
          >
            <X size={19} />
          </button>
        </div>

        {/* Amount */}
        <div className="mx-5 mt-5 rounded-xl bg-[#F0F5FF] p-5 text-center">
          <p className="text-xs font-medium text-[#8292B0]">
            Total Payment
          </p>

          <h3 className="mt-2 text-3xl font-extrabold text-[#246BFA]">
            {formatCurrency(payment.amount)}
          </h3>

          <span className="mt-3 inline-block rounded-full bg-white px-3 py-1 text-[10px] font-bold text-emerald-600">
            {payment.status}
          </span>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
          {details.map(([label, value]) => (
            <div key={label}>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8292B0]">
                {label}
              </p>

              <p className="mt-1 break-all text-xs font-bold text-[#344563]">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-[#E5EAF3] p-5 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="rounded-xl border border-[#DFE7F5] px-4 py-3 text-xs font-bold text-[#344563] hover:bg-gray-50"
          >
            Close
          </button>

          <button
            onClick={() => downloadInvoice(payment)}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#246BFA] px-4 py-3 text-xs font-bold text-white transition hover:bg-blue-700"
          >
            <Download size={15} />
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsModal;
