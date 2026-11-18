import { useEffect, useState } from "react";
import {
  X,
  Save,
  UserRound,
  Plane,
  Building2,
  FileText,
} from "lucide-react";

import {
  medicalTeamMembers,
  medicalCaseStatuses,
  formatMedicalDate,
} from "../data/medicalTourismData";

const MedicalCaseModal = ({ medicalCase, onClose, onSave }) => {
  const [formData, setFormData] = useState(medicalCase);

  useEffect(() => {
    setFormData(medicalCase);
  }, [medicalCase]);

  if (!medicalCase) return null;

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

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500";

  const labelClass =
    "mb-1.5 block text-sm font-medium text-slate-600";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Medical Case Details
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Case ID: {medicalCase.id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Patient information */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <UserRound size={19} className="text-blue-600" />
              <h3 className="font-semibold text-slate-800">
                Patient Information
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Patient Name</label>
                <input
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Country</label>
                <input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Phone</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <div className="border-t border-slate-100" />

          {/* Hospital information */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Building2 size={19} className="text-blue-600" />
              <h3 className="font-semibold text-slate-800">
                Treatment & Hospital
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Treatment</label>
                <input
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Hospital</label>
                <input
                  name="hospital"
                  value={formData.hospital}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Doctor</label>
                <input
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <div className="border-t border-slate-100" />

          {/* Visa and travel */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Plane size={19} className="text-blue-600" />
              <h3 className="font-semibold text-slate-800">
                Visa & Travel Information
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Visa Status</label>
                <select
                  name="visaStatus"
                  value={formData.visaStatus}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                  <option>Not Required</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Travel Status</label>
                <select
                  name="travelStatus"
                  value={formData.travelStatus}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option>Not Booked</option>
                  <option>Booked</option>
                  <option>Arrived</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Arrival Date</label>
                <input
                  type="date"
                  name="arrivalDate"
                  value={formData.arrivalDate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Departure Date</label>
                <input
                  type="date"
                  name="departureDate"
                  min={formData.arrivalDate || undefined}
                  value={formData.departureDate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Current travel period: {formatMedicalDate(formData.arrivalDate)}
              {" — "}
              {formatMedicalDate(formData.departureDate)}
            </p>
          </section>

          <div className="border-t border-slate-100" />

          {/* Case management */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <FileText size={19} className="text-blue-600" />
              <h3 className="font-semibold text-slate-800">
                Case Management
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Case Status</label>
                <select
                  name="caseStatus"
                  value={formData.caseStatus}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {medicalCaseStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Assigned Team Member</label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {medicalTeamMembers.map((member) => (
                    <option key={member} value={member}>
                      {member}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Internal Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Add patient updates or important notes..."
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicalCaseModal;