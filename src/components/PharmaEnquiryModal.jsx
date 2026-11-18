import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";

const PharmaEnquiryModal = ({
  enquiry,
  product,
  onClose,
  onSave,
}) => {
  const [status, setStatus] = useState(enquiry.status);

  useEffect(() => {
    setStatus(enquiry.status);
  }, [enquiry]);

  if (!enquiry) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...enquiry,
      status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Product Enquiry
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {enquiry.id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="space-y-3 rounded-xl bg-slate-50 p-4">
            <div>
              <p className="text-xs text-slate-400">Customer</p>
              <p className="font-semibold text-slate-800">
                {enquiry.customerName}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Email</p>
              <p className="text-sm text-slate-700">
                {enquiry.email}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Phone</p>
              <p className="text-sm text-slate-700">
                {enquiry.phone}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Product</p>
              <p className="text-sm font-medium text-slate-700">
                {product?.name || "Product not found"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Requested Quantity</p>
              <p className="text-sm text-slate-700">
                {enquiry.quantity}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Message</p>
              <p className="text-sm text-slate-700">
                {enquiry.message}
              </p>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-600">
              Enquiry Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Save size={16} />
              Update Enquiry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PharmaEnquiryModal;