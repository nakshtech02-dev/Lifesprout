import { useEffect, useState } from "react";
import { X, Save, UserRound } from "lucide-react";
import { formatGBP } from "../data/partnerData";

const PartnerDetailsModal = ({ partner, onClose, onSave, onMarkPaid }) => {
  const [formData, setFormData] = useState(partner);

  useEffect(() => {
    setFormData(partner);
  }, [partner]);

  if (!partner) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "commissionRate" ? Number(value) : value,
    }));
  };

  const commission = Math.round(
    formData.monthlySales * (formData.commissionRate / 100)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Partner Details
            </h2>
            <p className="mt-1 text-sm text-slate-500">{partner.id}</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Partner profile */}
          <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <UserRound size={26} />
            </div>

            <div>
              <h3 className="font-semibold text-slate-800">
                {partner.name}
              </h3>
              <p className="text-sm text-slate-500">{partner.email}</p>
              <p className="mt-1 text-xs text-slate-400">{partner.region}</p>
            </div>
          </div>

          {/* Editable details */}
          <div>
            <h3 className="mb-4 font-semibold text-slate-800">
              Partner Information
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">
                  Full Name
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">
                  Phone
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">
                  Region
                </label>
                <input
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">
                  Commission Rate (%)
                </label>
                <input
                  type="number"
                  name="commissionRate"
                  min="0"
                  max="100"
                  value={formData.commissionRate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">
                  Partner Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Monthly payout summary */}
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm font-medium text-slate-600">
              November 2026 Commission
            </p>

            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">Monthly Sales</p>
                <p className="mt-1 text-lg font-bold text-slate-800">
                  {formatGBP(formData.monthlySales)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Commission Earned</p>
                <p className="mt-1 text-lg font-bold text-blue-600">
                  {formatGBP(commission)}
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Calculated using a {formData.commissionRate}% commission rate.
            </p>
          </div>

          {/* Footer actions */}
          <div className="flex flex-wrap justify-between gap-3 border-t border-slate-100 pt-5">
            <div>
              {partner.payoutStatus !== "Paid" && (
                <button
                  type="button"
                  onClick={() => onMarkPaid(partner.id)}
                  className="rounded-lg border border-emerald-200 px-4 py-2.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
                >
                  Mark Payout as Paid
                </button>
              )}

              {partner.payoutStatus === "Paid" && (
                <span className="inline-flex rounded-lg bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">
                  Payout Already Paid
                </span>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartnerDetailsModal;