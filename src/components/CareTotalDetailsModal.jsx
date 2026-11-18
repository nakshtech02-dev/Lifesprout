
import { useEffect, useState } from "react";
import { X, Mail, Phone, CalendarDays, RefreshCw } from "lucide-react";
import { careTotalPlans } from "../data/careTotalData";

const CareTotalDetailsModal = ({ customer, onClose, onSave, onRenew }) => {
  const [formData, setFormData] = useState(customer);

  useEffect(() => {
    setFormData(customer);
  }, [customer]);

  if (!customer) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlanChange = (e) => {
    const selectedPlan = careTotalPlans.find(
      (plan) => plan.name === e.target.value
    );

    setFormData((prev) => ({
      ...prev,
      plan: selectedPlan.name,
      amount: selectedPlan.price,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Customer Details
            </h2>
            <p className="mt-1 text-xs text-gray-500">{customer.id}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          <div>
            <h3 className="font-semibold text-slate-800">{customer.name}</h3>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <p className="flex items-center gap-2 break-all text-sm text-gray-500">
                <Mail size={15} />
                {customer.email}
              </p>

              <p className="flex items-center gap-2 text-sm text-gray-500">
                <Phone size={15} />
                {customer.phone}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Subscription Plan
              </span>

              <select
                value={formData.plan}
                onChange={handlePlanChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                {careTotalPlans.map((plan) => (
                  <option key={plan.name} value={plan.name}>
                    {plan.name} - {formatCurrency(plan.price)}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Subscription Status
              </span>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Start Date
              </span>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Expiry Date
              </span>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </label>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-gray-500">Plan Amount</p>
            <p className="mt-1 text-xl font-bold text-slate-800">
              {formatCurrency(formData.amount)}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Payment status: {customer.paymentStatus}
            </p>
          </div>

          <div className="flex flex-col-reverse justify-between gap-3 border-t border-gray-100 pt-4 sm:flex-row">
            <button
              type="button"
              onClick={() => onRenew(customer)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              <RefreshCw size={16} />
              Renew 30 Days
            </button>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CareTotalDetailsModal;
