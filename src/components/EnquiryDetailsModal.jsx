
import { useEffect, useState } from "react";
import { X, Phone, Mail, CalendarDays, UserRound } from "lucide-react";
import { teamMembers } from "../data/enquiryData";

const EnquiryDetailsModal = ({ enquiry, onClose, onSave }) => {
  const [formData, setFormData] = useState(enquiry);

  useEffect(() => {
    setFormData(enquiry);
  }, [enquiry]);

  if (!enquiry) return null;

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
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Enquiry Details
            </h2>
            <p className="mt-1 text-xs text-gray-500">{enquiry.id}</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs text-gray-500">Customer Name</p>
              <p className="font-semibold text-slate-800">{enquiry.name}</p>
            </div>

            <div>
              <p className="mb-1 text-xs text-gray-500">Service</p>
              <p className="font-semibold text-slate-800">{enquiry.service}</p>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail size={16} />
              <span className="break-all">{enquiry.email}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone size={16} />
              {enquiry.phone}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Lead Status
              </span>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option>New</option>
                <option>Called</option>
                <option>Converted</option>
                <option>Lost</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Assign To
              </span>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                {teamMembers.map((member) => (
                  <option key={member} value={member}>
                    {member}
                  </option>
                ))}
              </select>
            </label>
          </div>

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

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              Notes
            </span>
            <textarea
              name="notes"
              rows="4"
              value={formData.notes || ""}
              onChange={handleChange}
              placeholder="Add notes about this enquiry..."
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </label>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
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
        </form>
      </div>
    </div>
  );
};

export default EnquiryDetailsModal;
