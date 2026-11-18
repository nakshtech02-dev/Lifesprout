
import { useEffect, useState } from "react";
import {
  X,
  Mail,
  Phone,
  CalendarDays,
} from "lucide-react";
import { demoTeamMembers } from "../data/demoData";

const DemoDetailsModal = ({ demo, onClose, onSave, onConvert }) => {
  const [formData, setFormData] = useState(demo);

  useEffect(() => {
    setFormData(demo);
  }, [demo]);

  if (!demo) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Demo Details
            </h2>
            <p className="mt-1 text-xs text-gray-500">{demo.id}</p>
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
          {/* Customer Information */}
          <div>
            <h3 className="font-semibold text-slate-800">{demo.name}</h3>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <p className="flex items-center gap-2 break-all text-sm text-gray-500">
                <Mail size={15} />
                {demo.email}
              </p>

              <p className="flex items-center gap-2 text-sm text-gray-500">
                <Phone size={15} />
                {demo.phone}
              </p>
            </div>

            <p className="mt-3 text-sm text-gray-500">
              Service: <span className="font-semibold text-slate-700">{demo.service}</span>
            </p>
          </div>

          {/* Demo Dates */}
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
                End Date
              </span>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </label>
          </div>

          {/* Status and Assignment */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Demo Status
              </span>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Converted">Converted</option>
                <option value="Expired">Expired</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Assigned To
              </span>

              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                {demoTeamMembers.map((member) => (
                  <option key={member} value={member}>
                    {member}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Follow-up */}
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <CalendarDays size={16} />
              Follow-up Date
            </span>

            <input
              type="date"
              name="followUpDate"
              value={formData.followUpDate || ""}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </label>

          {/* Notes */}
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Notes
            </span>

            <textarea
              name="notes"
              rows="4"
              value={formData.notes || ""}
              onChange={handleChange}
              placeholder="Add notes about this demo..."
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </label>

          {/* Buttons */}
          <div className="flex flex-col-reverse justify-between gap-3 border-t border-gray-100 pt-4 sm:flex-row">
            {demo.status === "Active" ? (
              <button
                type="button"
                onClick={() => onConvert(demo)}
                className="rounded-lg border border-emerald-200 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                Mark as Converted
              </button>
            ) : (
              <span />
            )}

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

export default DemoDetailsModal;
