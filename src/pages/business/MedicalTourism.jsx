import { useMemo, useState } from "react";
import {
  Users,
  Plane,
  Stethoscope,
  CheckCircle2,
  Search,
  Eye,
  MapPin,
  CalendarDays,
  Plus,
} from "lucide-react";

import {
  initialMedicalCases,
  formatMedicalDate,
} from "../../data/medicalTourismData";

import MedicalCaseModal from "../../components/MedicalCaseModal";

const MedicalTourism = () => {
  const [cases, setCases] = useState(initialMedicalCases);
  const [selectedCase, setSelectedCase] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [visaFilter, setVisaFilter] = useState("All");

  // Dashboard statistics
  const totalCases = cases.length;

  const activeCases = cases.filter(
    (item) =>
      !["Completed", "Cancelled"].includes(item.caseStatus)
  ).length;

  const travelArranged = cases.filter(
    (item) => item.travelStatus === "Booked"
  ).length;

  const completedCases = cases.filter(
    (item) => item.caseStatus === "Completed"
  ).length;

  // Search and filters
  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        item.patientName.toLowerCase().includes(search) ||
        item.email.toLowerCase().includes(search) ||
        item.id.toLowerCase().includes(search) ||
        item.country.toLowerCase().includes(search) ||
        item.hospital.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        item.caseStatus === statusFilter;

      const matchesVisa =
        visaFilter === "All" ||
        item.visaStatus === visaFilter;

      return matchesSearch && matchesStatus && matchesVisa;
    });
  }, [cases, searchTerm, statusFilter, visaFilter]);

  // Save updated case
  const handleSaveCase = (updatedCase) => {
    setCases((prev) =>
      prev.map((item) =>
        item.id === updatedCase.id ? updatedCase : item
      )
    );

    setSelectedCase(null);
  };

  const stats = [
    {
      title: "Total Cases",
      value: totalCases,
      description: "All registered patients",
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Active Cases",
      value: activeCases,
      description: "Cases currently in progress",
      icon: Stethoscope,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      title: "Travel Arranged",
      value: travelArranged,
      description: "Patients with booked travel",
      icon: Plane,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Completed Cases",
      value: completedCases,
      description: "Successfully completed",
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
  ];

  const getStatusStyle = (status) => {
    const styles = {
      Enquiry: "bg-blue-50 text-blue-700",
      Consultation: "bg-violet-50 text-violet-700",
      "Visa Processing": "bg-orange-50 text-orange-700",
      "Travel Arranged": "bg-cyan-50 text-cyan-700",
      Treatment: "bg-amber-50 text-amber-700",
      Completed: "bg-emerald-50 text-emerald-700",
      Cancelled: "bg-rose-50 text-rose-700",
    };

    return styles[status] || "bg-slate-100 text-slate-600";
  };

  const getVisaStyle = (status) => {
    const styles = {
      Approved: "bg-emerald-50 text-emerald-700",
      Processing: "bg-orange-50 text-orange-700",
      Pending: "bg-amber-50 text-amber-700",
      Rejected: "bg-rose-50 text-rose-700",
      "Not Required": "bg-slate-100 text-slate-600",
    };

    return styles[status] || "bg-slate-100 text-slate-600";
  };

  const getTravelStyle = (status) => {
    const styles = {
      Booked: "bg-blue-50 text-blue-700",
      Arrived: "bg-violet-50 text-violet-700",
      Completed: "bg-emerald-50 text-emerald-700",
      "Not Booked": "bg-orange-50 text-orange-700",
      Cancelled: "bg-rose-50 text-rose-700",
    };

    return styles[status] || "bg-slate-100 text-slate-600";
  };

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Medical Tourism
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage international patients, hospitals, visas and travel arrangements.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600">
          <CalendarDays size={17} className="text-blue-600" />
          Patient Case Management
        </div>
      </div>

      {/* Statistics */}
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

      {/* Case progress overview */}
      <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-bold text-slate-800">
              Case Progress Overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Current distribution of patient cases.
            </p>
          </div>

          <span className="text-sm text-slate-400">
            {totalCases} total cases
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Enquiry",
              count: cases.filter((item) => item.caseStatus === "Enquiry").length,
              color: "bg-blue-500",
            },
            {
              label: "Visa Processing",
              count: cases.filter((item) => item.caseStatus === "Visa Processing").length,
              color: "bg-orange-500",
            },
            {
              label: "Treatment",
              count: cases.filter((item) => item.caseStatus === "Treatment").length,
              color: "bg-amber-500",
            },
            {
              label: "Completed",
              count: completedCases,
              color: "bg-emerald-500",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg bg-slate-50 p-4"
            >
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                <p className="text-xs font-medium text-slate-500">
                  {item.label}
                </p>
              </div>

              <p className="mt-2 text-xl font-bold text-slate-800">
                {item.count}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Patient cases table */}
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        {/* Table header */}
        <div className="border-b border-slate-100 p-5">
          <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
            <div>
              <h2 className="font-bold text-slate-800">
                Patient Cases
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                View and manage all medical tourism patients.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 sm:w-56"
                />
              </div>

              {/* Case status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-500"
              >
                <option value="All">All Case Status</option>
                <option value="Enquiry">Enquiry</option>
                <option value="Consultation">Consultation</option>
                <option value="Visa Processing">Visa Processing</option>
                <option value="Travel Arranged">Travel Arranged</option>
                <option value="Treatment">Treatment</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              {/* Visa filter */}
              <select
                value={visaFilter}
                onChange={(e) => setVisaFilter(e.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-500"
              >
                <option value="All">All Visa Status</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Not Required">Not Required</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1150px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4">Patient</th>
                <th className="px-5 py-4">Treatment / Hospital</th>
                <th className="px-5 py-4">Travel Dates</th>
                <th className="px-5 py-4">Visa</th>
                <th className="px-5 py-4">Travel</th>
                <th className="px-5 py-4">Case Status</th>
                <th className="px-5 py-4">Assigned To</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredCases.map((item) => (
                <tr
                  key={item.id}
                  className="text-sm transition hover:bg-slate-50/70"
                >
                  {/* Patient */}
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">
                      {item.patientName}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {item.email}
                    </p>

                    <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                      <MapPin size={12} />
                      {item.country}
                    </div>

                    <p className="mt-1 text-xs text-slate-400">
                      {item.id}
                    </p>
                  </td>

                  {/* Treatment and hospital */}
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-700">
                      {item.treatment}
                    </p>

                    <p className="mt-1 max-w-52 text-xs text-slate-400">
                      {item.hospital}
                    </p>
                  </td>

                  {/* Travel dates */}
                  <td className="px-5 py-4">
                    <p className="text-xs text-slate-600">
                      <span className="text-slate-400">Arrival:</span>{" "}
                      {formatMedicalDate(item.arrivalDate)}
                    </p>

                    <p className="mt-2 text-xs text-slate-600">
                      <span className="text-slate-400">Departure:</span>{" "}
                      {formatMedicalDate(item.departureDate)}
                    </p>
                  </td>

                  {/* Visa */}
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getVisaStyle(item.visaStatus)}`}
                    >
                      {item.visaStatus}
                    </span>
                  </td>

                  {/* Travel */}
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getTravelStyle(item.travelStatus)}`}
                    >
                      {item.travelStatus}
                    </span>
                  </td>

                  {/* Case status */}
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(item.caseStatus)}`}
                    >
                      {item.caseStatus}
                    </span>
                  </td>

                  {/* Assigned team member */}
                  <td className="px-5 py-4 text-slate-600">
                    {item.assignedTo}
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4">
                    <button
                      onClick={() => setSelectedCase(item)}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Eye size={15} />
                      Details
                    </button>
                  </td>
                </tr>
              ))}

              {filteredCases.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-12 text-center text-sm text-slate-400"
                  >
                    No medical tourism cases found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="border-t border-slate-100 px-5 py-4">
          <p className="text-xs text-slate-500">
            Showing {filteredCases.length} of {cases.length} cases
          </p>
        </div>
      </div>

      {/* Details modal */}
      {selectedCase && (
        <MedicalCaseModal
          medicalCase={selectedCase}
          onClose={() => setSelectedCase(null)}
          onSave={handleSaveCase}
        />
      )}
    </div>
  );
};

export default MedicalTourism;