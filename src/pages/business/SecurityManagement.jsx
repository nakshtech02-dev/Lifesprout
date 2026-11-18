
import React, { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Bell,
  Database,
  Download,
  CheckCircle,
  XCircle,
  Monitor,
  MapPin,
  Search,
  LockKeyhole,
  RefreshCw,
} from "lucide-react";

import {
  initialSecuritySettings,
  initialBackups,
  initialLoginAlerts,
} from "../../data/securityData";

const SecurityManagement = () => {
  const [settings, setSettings] = useState(initialSecuritySettings);
  const [backups, setBackups] = useState(initialBackups);
  const [loginAlerts, setLoginAlerts] = useState(initialLoginAlerts);

  const [searchTerm, setSearchTerm] = useState("");
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const formatDate = (dateString) => {
    return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Demo OTP verification
  const handleOtpVerification = (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(otpCode)) {
      setOtpMessage("Please enter a valid 6-digit demo code.");
      return;
    }

    setOtpVerified(true);
    setOtpMessage("Demo verification successful.");
  };

  const closeOtpModal = () => {
    setOtpModalOpen(false);
    setOtpCode("");
    setOtpMessage("");
    setOtpVerified(false);
  };

  // Download demo JSON backup
  const downloadBackup = (backupHistory = backups) => {
    const backupData = {
      generatedAt: new Date().toISOString(),
      note: "Frontend demonstration backup. Not a complete server backup.",
      securitySettings: settings,
      loginAlerts,
      backupHistory,
    };

    const file = new Blob(
      [JSON.stringify(backupData, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = `lifesprout-demo-backup-${Date.now()}.json`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Create a new demo backup record
  const createBackupRecord = () => {
    const now = new Date();

    const newBackup = {
      id: `BKP-${Date.now()}`,
      date: now.toISOString().slice(0, 10),
      time: now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      size: "Demo file",
      status: "Completed",
    };

    const updatedBackups = [newBackup, ...backups];

    setBackups(updatedBackups);
    downloadBackup(updatedBackups);
  };

  const filteredAlerts = loginAlerts.filter((alert) => {
    const search = searchTerm.toLowerCase();

    return (
      alert.user.toLowerCase().includes(search) ||
      alert.email.toLowerCase().includes(search) ||
      alert.location.toLowerCase().includes(search) ||
      alert.id.toLowerCase().includes(search)
    );
  });

  const newAlerts = loginAlerts.filter(
    (alert) => alert.alertStatus === "New"
  ).length;

  const failedLogins = loginAlerts.filter(
    (alert) => alert.status === "Failed"
  ).length;

  const reviewedAlerts = loginAlerts.filter(
    (alert) => alert.alertStatus === "Reviewed"
  ).length;

  const markAsReviewed = (id) => {
    setLoginAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id
          ? { ...alert, alertStatus: "Reviewed" }
          : alert
      )
    );
  };

  const securityStats = [
    {
      title: "OTP Protection",
      value: settings.otpEnabled ? "Enabled" : "Disabled",
      description: "Two-factor setting",
      icon: ShieldCheck,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Login Alerts",
      value: settings.loginAlertsEnabled ? "Active" : "Disabled",
      description: "Login notification setting",
      icon: Bell,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "New Alerts",
      value: newAlerts,
      description: "Awaiting review",
      icon: ShieldAlert,
      color: "bg-orange-50 text-orange-600",
    },
    {
      title: "Failed Logins",
      value: failedLogins,
      description: "In demo activity",
      icon: XCircle,
      color: "bg-red-50 text-red-600",
    },
  ];

  // Reusable toggle switch
  const Toggle = ({ checked, onChange }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? "bg-blue-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`pointer-events-none absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );

  // Reusable settings action area
  const SettingsActions = ({ enabled, onChange, children }) => (
    <div className="flex w-full min-w-0 flex-wrap items-center gap-3 sm:w-auto sm:justify-end">
      <span className="min-w-[65px] text-sm text-gray-500 sm:text-right">
        {enabled ? "Enabled" : "Disabled"}
      </span>

      <Toggle checked={enabled} onChange={onChange} />

      {children}
    </div>
  );

  return (
    <div className="min-w-0 space-y-6">

      {/* Page Heading */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-800">
            Security Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage security settings, backups and login activity.
          </p>
        </div>

        <div className="flex w-fit shrink-0 items-center gap-2 rounded-lg bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700">
          <ShieldCheck size={18} />
          Security Center
        </div>
      </div>

      {/* Security Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {securityStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="min-w-0 rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-800">
                    {stat.value}
                  </h2>
                  <p className="mt-1 text-xs text-gray-400">
                    {stat.description}
                  </p>
                </div>

                <div className={`shrink-0 rounded-xl p-3 ${stat.color}`}>
                  <Icon size={21} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security Settings */}
      <div className="min-w-0 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="font-bold text-gray-800">
            Security Settings
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure the security options shown in this dashboard.
          </p>
        </div>

        <div className="divide-y divide-gray-100">

          {/* OTP Setting */}
          <div className="flex min-w-0 flex-col justify-between gap-4 py-5 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-start gap-3">
              <div className="shrink-0 rounded-lg bg-blue-50 p-3 text-blue-600">
                <Smartphone size={21} />
              </div>

              <div className="min-w-0">
                <h3 className="font-semibold text-gray-800">
                  OTP / Two-Factor Authentication
                </h3>
                <p className="mt-1 max-w-xl text-sm text-gray-500">
                  Enable an additional verification step for account access.
                </p>
                <span className="mt-2 inline-block text-xs text-orange-600">
                  Demo setting only — no real OTP is sent.
                </span>
              </div>
            </div>

            <SettingsActions
              enabled={settings.otpEnabled}
              onChange={(value) => updateSetting("otpEnabled", value)}
            >
              {settings.otpEnabled && (
                <button
                  type="button"
                  onClick={() => setOtpModalOpen(true)}
                  className="shrink-0 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                >
                  Test OTP
                </button>
              )}
            </SettingsActions>
          </div>

          {/* Login Alert Setting */}
          <div className="flex min-w-0 flex-col justify-between gap-4 py-5 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-start gap-3">
              <div className="shrink-0 rounded-lg bg-purple-50 p-3 text-purple-600">
                <Bell size={21} />
              </div>

              <div className="min-w-0">
                <h3 className="font-semibold text-gray-800">
                  Login Alerts
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Show a dashboard alert when a login event is recorded.
                </p>
              </div>
            </div>

            <SettingsActions
              enabled={settings.loginAlertsEnabled}
              onChange={(value) =>
                updateSetting("loginAlertsEnabled", value)
              }
            />
          </div>

          {/* Backup Setting */}
          <div className="flex min-w-0 flex-col justify-between gap-4 py-5 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-start gap-3">
              <div className="shrink-0 rounded-lg bg-green-50 p-3 text-green-600">
                <Database size={21} />
              </div>

              <div className="min-w-0">
                <h3 className="font-semibold text-gray-800">
                  Daily Backup
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Display the daily backup schedule for the dashboard.
                </p>
                <span className="mt-2 inline-block text-xs text-orange-600">
                  Automatic server backups are not configured.
                </span>
              </div>
            </div>

            <SettingsActions
              enabled={settings.dailyBackupEnabled}
              onChange={(value) =>
                updateSetting("dailyBackupEnabled", value)
              }
            />
          </div>

          {/* Backup Time */}
          <div className="flex min-w-0 flex-col justify-between gap-3 py-5 sm:flex-row sm:items-center">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-800">
                Scheduled Backup Time
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Preferred time for the daily backup.
              </p>
            </div>

            <input
              type="time"
              value={settings.backupTime}
              disabled={!settings.dailyBackupEnabled}
              onChange={(e) =>
                updateSetting("backupTime", e.target.value)
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 sm:w-auto"
            />
          </div>
        </div>
      </div>

      {/* Backup Management */}
      <div className="min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <h2 className="font-bold text-gray-800">
              Backup Management
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Review backup history and download a demo backup.
            </p>
          </div>

          <button
            type="button"
            onClick={createBackupRecord}
            disabled={!settings.dailyBackupEnabled}
            className="inline-flex w-fit max-w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <RefreshCw size={17} className="shrink-0" />
            Create Demo Backup
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Backup ID</th>
                <th className="px-5 py-4 font-semibold">Date</th>
                <th className="px-5 py-4 font-semibold">Time</th>
                <th className="px-5 py-4 font-semibold">Size</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {backups.map((backup) => (
                <tr key={backup.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium text-gray-700">
                    {backup.id}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {formatDate(backup.date)}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {backup.time}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {backup.size}
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                      <CheckCircle size={13} />
                      {backup.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => downloadBackup()}
                      className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                    >
                      <Download size={14} />
                      Download Demo
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Login Alerts */}
      <div className="min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h2 className="font-bold text-gray-800">
              Recent Login Activity
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Review login events and their alert status.
            </p>
          </div>

          <div className="relative w-full min-w-0 lg:w-64 lg:shrink-0">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search login activity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-5 py-4 font-semibold">User</th>
                <th className="px-5 py-4 font-semibold">Device</th>
                <th className="px-5 py-4 font-semibold">Location</th>
                <th className="px-5 py-4 font-semibold">IP Address</th>
                <th className="px-5 py-4 font-semibold">Date & Time</th>
                <th className="px-5 py-4 font-semibold">Login Status</th>
                <th className="px-5 py-4 text-right font-semibold">Alert</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredAlerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-800">
                      {alert.user}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {alert.email}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Monitor size={16} />
                      {alert.device}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin size={14} />
                      {alert.location}
                    </div>
                  </td>

                  <td className="px-5 py-4 font-mono text-xs text-gray-600">
                    {alert.ipAddress}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    <p>{formatDate(alert.date)}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      {alert.time}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        alert.status === "Successful"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {alert.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    {alert.alertStatus === "New" ? (
                      <button
                        type="button"
                        onClick={() => markAsReviewed(alert.id)}
                        className="whitespace-nowrap rounded-lg bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 hover:bg-orange-100"
                      >
                        Mark Reviewed
                      </button>
                    ) : (
                      <span className="text-xs font-medium text-green-600">
                        Reviewed
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {filteredAlerts.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No login activity found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100 px-5 py-3 text-xs text-gray-500">
          Showing {filteredAlerts.length} login records · {reviewedAlerts} reviewed
        </div>
      </div>

      {/* OTP Demo Modal */}
      {otpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="shrink-0 rounded-xl bg-blue-50 p-3 text-blue-600">
                  <LockKeyhole size={22} />
                </div>

                <div className="min-w-0">
                  <h2 className="font-bold text-gray-800">
                    OTP Verification Demo
                  </h2>
                  <p className="text-xs text-gray-500">
                    Test the sample verification interface
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeOtpModal}
                aria-label="Close OTP modal"
                className="shrink-0 rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <XCircle size={20} />
              </button>
            </div>

            {otpVerified ? (
              <div className="rounded-xl bg-green-50 p-5 text-center">
                <CheckCircle className="mx-auto mb-2 text-green-600" size={32} />
                <h3 className="font-semibold text-green-700">
                  Demo Verification Successful
                </h3>
                <p className="mt-1 text-sm text-green-600">
                  The sample OTP interface is working.
                </p>
              </div>
            ) : (
              <form onSubmit={handleOtpVerification}>
                <p className="mb-4 text-sm text-gray-600">
                  Enter any six-digit number to test this frontend demo.
                  No OTP will be sent to a phone or email.
                </p>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => {
                    setOtpCode(e.target.value.replace(/\D/g, ""));
                    setOtpMessage("");
                  }}
                  placeholder="Enter 6-digit code"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-center text-xl tracking-[0.5em] outline-none focus:border-blue-500"
                />

                {otpMessage && (
                  <p className="mt-2 text-sm text-orange-600">
                    {otpMessage}
                  </p>
                )}

                <button
                  type="submit"
                  className="mt-4 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Verify Demo Code
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={closeOtpModal}
              className="mt-3 w-full rounded-lg border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityManagement;
    