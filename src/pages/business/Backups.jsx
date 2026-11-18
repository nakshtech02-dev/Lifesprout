
import React, { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Download,
  Trash2,
  Database,
  HardDriveDownload,
  CheckCircle,
  Clock,
  FileJson,
  CalendarDays,
  X,
  AlertCircle,
} from "lucide-react";
import { initialBackups } from "../../data/securityData";

const STORAGE_KEY = "lifesprout_backups";

const getSavedBackups = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Unable to load backups:", error);
  }

  return initialBackups;
};

const Backups = () => {
  const [backups, setBackups] = useState(getSavedBackups);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const saveBackups = (updatedBackups) => {
    setBackups(updatedBackups);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBackups));
    } catch (error) {
      console.error("Unable to save backup history:", error);
      alert("Unable to save backup history in this browser.");
    }
  };

  const stats = useMemo(() => {
    return {
      total: backups.length,
      completed: backups.filter(
        (backup) => backup.status === "Completed"
      ).length,
      pending: backups.filter(
        (backup) => backup.status === "Pending"
      ).length,
      failed: backups.filter(
        (backup) => backup.status === "Failed"
      ).length,
    };
  }, [backups]);

  const filteredBackups = useMemo(() => {
    return backups.filter((backup) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        backup.id?.toLowerCase().includes(search) ||
        backup.date?.toLowerCase().includes(search) ||
        backup.time?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" || backup.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [backups, searchTerm, statusFilter]);

  // Generate and download a demo JSON backup file.
  const downloadBackup = (backup) => {
    const backupData = {
      generatedAt: new Date().toISOString(),
      backupInformation: backup,
      note:
        "This is a frontend demonstration backup. It does not contain a complete server, database, or website backup.",
      application: "Lifesprout Care Owner Dashboard",
      backupType: "Demo JSON backup",
    };

    const blob = new Blob(
      [JSON.stringify(backupData, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `lifesprout-backup-${backup.id}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // Create a new backup record and download it.
  const createBackup = () => {
    const now = new Date();

    const newBackup = {
      id: `BKP-${Date.now()}`,
      date: now.toISOString().split("T")[0],
      time: now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      size: "Demo file",
      status: "Completed",
    };

    const updatedBackups = [newBackup, ...backups];

    // Save the new record before downloading.
    saveBackups(updatedBackups);

    // Download using the newly created record.
    downloadBackup(newBackup);

    setShowCreateModal(false);
  };

  const deleteBackup = (backup) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete backup record ${backup.id}?`
    );

    if (!confirmed) return;

    const updatedBackups = backups.filter(
      (item) => item.id !== backup.id
    );

    saveBackups(updatedBackups);
  };

  const statusStyle = (status) => {
    const styles = {
      Completed: "bg-green-50 text-green-700",
      Pending: "bg-orange-50 text-orange-700",
      Failed: "bg-red-50 text-red-700",
    };

    return styles[status] || "bg-gray-100 text-gray-600";
  };

  const statCards = [
    {
      title: "Total Backups",
      value: stats.total,
      icon: Database,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "bg-orange-50 text-orange-600",
    },
    {
      title: "Failed",
      value: stats.failed,
      icon: AlertCircle,
      color: "bg-red-50 text-red-600",
    },
  ];

  return (
    <div className="min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <span>Security</span>
            <span>/</span>
            <span className="text-blue-600">Backups</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-800">
            Backups Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View backup history and manage your backup records.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Create Backup
        </button>
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <AlertCircle size={20} className="mt-0.5 shrink-0 text-amber-600" />

        <div>
          <p className="text-sm font-semibold text-amber-800">
            Demo backup system
          </p>
          <p className="mt-1 text-xs leading-5 text-amber-700">
            This page creates downloadable JSON demonstration files and stores
            backup history in your browser. It does not create a real server or
            database backup.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-800">
                    {stat.value}
                  </h2>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Backup Storage Summary */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <HardDriveDownload size={27} />
          </div>

          <div>
            <h3 className="font-bold text-gray-800">Backup History</h3>
            <p className="mt-1 text-sm text-gray-500">
              {stats.total} backup records available in this browser.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-green-600">
            <CheckCircle size={27} />
          </div>

          <div>
            <h3 className="font-bold text-gray-800">Backup Status</h3>
            <p className="mt-1 text-sm text-gray-500">
              {stats.completed} of {stats.total} records are marked completed.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search backup ID or date..."
              className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Backup History Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-2 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Backup History
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Review and download your backup records.
            </p>
          </div>

          <span className="text-xs text-gray-400">
            {filteredBackups.length} records found
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="bg-gray-50">
              <tr className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-5 py-4">Backup ID</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Time</th>
                <th className="px-5 py-4">Size</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredBackups.length > 0 ? (
                filteredBackups.map((backup) => (
                  <tr
                    key={backup.id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <FileJson size={18} />
                        </div>

                        <span className="text-sm font-semibold text-gray-800">
                          {backup.id}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      <span className="flex items-center gap-2">
                        <CalendarDays size={15} className="text-gray-400" />
                        {backup.date}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {backup.time}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {backup.size}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(backup.status)}`}
                      >
                        {backup.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {backup.status === "Completed" && (
                          <button
                            onClick={() => downloadBackup(backup)}
                            title="Download backup"
                            className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                          >
                            <Download size={17} />
                          </button>
                        )}

                        <button
                          onClick={() => deleteBackup(backup)}
                          title="Delete record"
                          className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-5 py-14 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
                      <Database size={27} />
                    </div>

                    <h3 className="mt-3 font-semibold text-gray-800">
                      No backups found
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Try changing your search or filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Backup Confirmation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <HardDriveDownload size={23} />
              </div>

              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <h2 className="mt-5 text-lg font-bold text-gray-800">
              Create Manual Backup?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              A new demo backup record will be created and a JSON file will
              automatically download to your computer.
            </p>

            <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-700">
              This is a demonstration file only. It does not back up your
              actual application database or server files.
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={createBackup}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Download size={17} />
                Create & Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Backups;
