
import { useMemo, useState } from "react";

import {
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Ban,
  Trash2,
  Crown,
  ArrowRightLeft,
  Mail,
  Shield,
  CheckCircle2,
  X,
  ChevronDown,
} from "lucide-react";

import AdminModal from "../../components/AdminModal";

import {
  initialAdmins,
} from "../../data/adminData";

const AdminManagement = () => {
  const [admins, setAdmins] = useState(initialAdmins);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [menuId, setMenuId] = useState(null);

  const [transferOpen, setTransferOpen] = useState(false);
  const [newOwnerId, setNewOwnerId] = useState("");

  // Find current owner
  const owner = admins.find((admin) => admin.isOwner);

  // Calculate statistics
  const totalAdmins = admins.filter(
    (admin) => !admin.isOwner
  ).length;

  const activeAdmins = admins.filter(
    (admin) => !admin.isOwner && admin.status === "Active"
  ).length;

  const blockedAdmins = admins.filter(
    (admin) => !admin.isOwner && admin.status === "Blocked"
  ).length;

  const totalCategories = [
    ...new Set(
      admins
        .filter((admin) => !admin.isOwner)
        .flatMap((admin) => admin.categories)
    ),
  ].length;

  // Search and filter
  const filteredAdmins = useMemo(() => {
    return admins
      .filter((admin) => !admin.isOwner)
      .filter((admin) => {
        const matchesSearch =
          admin.name.toLowerCase().includes(search.toLowerCase()) ||
          admin.email.toLowerCase().includes(search.toLowerCase());

        const matchesRole =
          roleFilter === "All" || admin.role === roleFilter;

        const matchesStatus =
          statusFilter === "All" || admin.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
      });
  }, [admins, search, roleFilter, statusFilter]);

  // Open add modal
  const handleAddAdmin = () => {
    setSelectedAdmin(null);
    setIsModalOpen(true);
  };

  // Open edit modal
  const handleEditAdmin = (admin) => {
    setSelectedAdmin(admin);
    setIsModalOpen(true);
    setMenuId(null);
  };

  // Save admin
  const handleSaveAdmin = (formData) => {
    const duplicateEmail = admins.some(
      (admin) =>
        admin.email.toLowerCase() === formData.email.toLowerCase() &&
        admin.id !== selectedAdmin?.id
    );

    if (duplicateEmail) {
      alert("An admin with this email already exists.");
      return;
    }

    if (selectedAdmin) {
      setAdmins((prev) =>
        prev.map((admin) =>
          admin.id === selectedAdmin.id
            ? { ...admin, ...formData }
            : admin
        )
      );
    } else {
      const newAdmin = {
        ...formData,
        id: Date.now(),
        status: "Active",
        lastLogin: "Never logged in",
        isOwner: false,
      };

      setAdmins((prev) => [...prev, newAdmin]);
    }

    setIsModalOpen(false);
    setSelectedAdmin(null);
  };

  // Block / unblock admin
  const handleToggleStatus = (admin) => {
    const nextStatus =
      admin.status === "Active" ? "Blocked" : "Active";

    const confirmed = window.confirm(
      `${nextStatus === "Blocked" ? "Block" : "Unblock"} ${admin.name}?`
    );

    if (!confirmed) return;

    setAdmins((prev) =>
      prev.map((item) =>
        item.id === admin.id
          ? { ...item, status: nextStatus }
          : item
      )
    );

    setMenuId(null);
  };

  // Delete admin
  const handleDeleteAdmin = (admin) => {
    if (admin.isOwner) {
      alert("The owner cannot be removed.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to remove ${admin.name}?`
    );

    if (!confirmed) return;

    setAdmins((prev) =>
      prev.filter((item) => item.id !== admin.id)
    );

    setMenuId(null);
  };

  // Ownership transfer
  const handleTransferOwnership = () => {
    if (!newOwnerId) {
      alert("Please select an admin first.");
      return;
    }

    const nextOwner = admins.find(
      (admin) => admin.id === Number(newOwnerId)
    );

    if (!nextOwner || nextOwner.status !== "Active") {
      alert("Select an active admin.");
      return;
    }

    const confirmed = window.confirm(
      `Transfer ownership to ${nextOwner.name}? The current owner will become an admin.`
    );

    if (!confirmed) return;

    setAdmins((prev) =>
      prev.map((admin) => {
        if (admin.id === owner.id) {
          return {
            ...admin,
            isOwner: false,
            role: "Admin",
            categories: [],
            permissions: [],
          };
        }

        if (admin.id === nextOwner.id) {
          return {
            ...admin,
            isOwner: true,
            role: "Owner",
            categories: ["All Categories"],
            permissions: [
              "Manage Admins",
              "Manage Articles",
              "Manage Payments",
              "Manage Enquiries",
              "Manage Settings",
              "View Analytics",
            ],
          };
        }

        return admin;
      })
    );

    setTransferOpen(false);
    setNewOwnerId("");
  };

  return (
    <div
      className="space-y-5"
      onClick={() => menuId && setMenuId(null)}
    >
      {/* Page Heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-[#0B1C3B]">
            Admin Management
          </h2>

          <p className="mt-1 text-sm text-[#8292B0]">
            Manage your owner account, administrators, roles and permissions.
          </p>
        </div>

        <button
          onClick={handleAddAdmin}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#246BFA] px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={17} />
          Add New Admin
        </button>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

        {[
          {
            label: "Total Admins",
            value: totalAdmins,
            icon: Users,
            color: "bg-blue-50 text-blue-600",
          },
          {
            label: "Active Admins",
            value: activeAdmins,
            icon: UserCheck,
            color: "bg-emerald-50 text-emerald-600",
          },
          {
            label: "Blocked Admins",
            value: blockedAdmins,
            icon: UserX,
            color: "bg-red-50 text-red-600",
          },
          {
            label: "Assigned Categories",
            value: totalCategories,
            icon: ShieldCheck,
            color: "bg-purple-50 text-purple-600",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-center gap-4 rounded-2xl border border-[#DFE7F5] bg-white p-5 transition hover:shadow-md"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}
              >
                <Icon size={22} />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[#0B1C3B]">
                  {item.value}
                </h3>

                <p className="mt-1 text-xs text-[#8292B0]">
                  {item.label}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Owner Card */}
      {owner && (
        <section className="rounded-2xl border border-[#D8E5FF] bg-white p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-[#0B1C3B]">
                Account Owner
              </h3>

              <p className="mt-1 text-xs text-[#8292B0]">
                Full control over the entire Lifesprout Care platform.
              </p>
            </div>

            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-bold text-amber-600">
              <Crown size={13} />
              PRIMARY OWNER
            </span>
          </div>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2470F9] to-[#35B7B4] text-xl font-bold text-white">
                {owner.name.charAt(0)}
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#0B1C3B]">
                  {owner.name}
                </h4>

                <p className="mt-1 flex items-center gap-1.5 text-xs text-[#8292B0]">
                  <Mail size={13} />
                  {owner.email}
                </p>

                <p className="mt-1 text-[11px] font-medium text-emerald-600">
                  ● Active · Full access
                </p>
              </div>
            </div>

            <button
              onClick={() => setTransferOpen(true)}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#DFE7F5] px-4 py-3 text-xs font-bold text-[#246BFA] transition hover:border-blue-300 hover:bg-blue-50"
            >
              <ArrowRightLeft size={16} />
              Transfer Ownership
            </button>
          </div>
        </section>
      )}

      {/* Admin Table Section */}
      <section className="overflow-hidden rounded-2xl border border-[#DFE7F5] bg-white">

        {/* Table heading */}
        <div className="border-b border-[#E5EAF3] p-5">
          <div className="mb-4">
            <h3 className="text-base font-bold text-[#0B1C3B]">
              Administrators
            </h3>

            <p className="mt-1 text-xs text-[#8292B0]">
              View and manage your team members.
            </p>
          </div>

          {/* Search and filters */}
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8292B0]"
              />

              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[#DFE7F5] py-3 pl-10 pr-4 text-xs outline-none transition focus:border-[#246BFA]"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl border border-[#DFE7F5] bg-white px-4 py-3 text-xs text-[#344563] outline-none focus:border-[#246BFA]"
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Editor">Editor</option>
              <option value="Reviewer">Reviewer</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-[#DFE7F5] bg-white px-4 py-3 text-xs text-[#344563] outline-none focus:border-[#246BFA]"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>
        </div>

        {/* Responsive table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-[#F8FAFE]">
              <tr className="text-[10px] font-bold uppercase tracking-wider text-[#8292B0]">
                <th className="px-5 py-4">Admin</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Categories</th>
                <th className="px-5 py-4">Last Login</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAdmins.map((admin) => (
                <tr
                  key={admin.id}
                  className="border-b border-[#E5EAF3] transition hover:bg-[#F8FAFE] last:border-0"
                >
                  {/* Admin details */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF2FF] text-sm font-bold text-[#246BFA]">
                        {admin.name.charAt(0)}
                      </div>

                      <div>
                        <p className="text-xs font-bold text-[#0B1C3B]">
                          {admin.name}
                        </p>

                        <p className="mt-1 text-[10px] text-[#8292B0]">
                          {admin.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-5 py-4">
                    <span className="rounded-lg bg-[#EEF3FF] px-3 py-1.5 text-[10px] font-bold text-[#246BFA]">
                      {admin.role}
                    </span>
                  </td>

                  {/* Categories */}
                  <td className="px-5 py-4">
                    <div className="flex max-w-[190px] flex-wrap gap-1.5">
                      {admin.categories.length > 0 ? (
                        admin.categories.map((category) => (
                          <span
                            key={category}
                            className="rounded-md bg-[#F0F4FA] px-2 py-1 text-[9px] font-medium text-[#63728C]"
                          >
                            {category}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-[#A0AEC0]">
                          Not assigned
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Last Login */}
                  <td className="px-5 py-4">
                    <span className="text-[10px] text-[#8292B0]">
                      {admin.lastLogin}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[9px] font-bold ${
                        admin.status === "Active"
                          ? "bg-[#E0F6EA] text-[#079653]"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          admin.status === "Active"
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        }`}
                      />
                      {admin.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuId(
                            menuId === admin.id ? null : admin.id
                          );
                        }}
                        className="rounded-lg p-2 text-[#8292B0] transition hover:bg-[#EEF3FF] hover:text-[#246BFA]"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {menuId === admin.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-10 z-20 w-44 rounded-xl border border-[#E5EAF3] bg-white p-2 text-left shadow-xl"
                        >
                          <button
                            onClick={() => handleEditAdmin(admin)}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium text-[#344563] hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Pencil size={14} />
                            Edit Admin
                          </button>

                          <button
                            onClick={() =>
                              handleToggleStatus(admin)
                            }
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium text-[#344563] hover:bg-amber-50 hover:text-amber-600"
                          >
                            {admin.status === "Active" ? (
                              <>
                                <Ban size={14} />
                                Block Admin
                              </>
                            ) : (
                              <>
                                <CheckCircle2 size={14} />
                                Unblock Admin
                              </>
                            )}
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteAdmin(admin)
                            }
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                            Remove Admin
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {/* Empty state */}
              {filteredAdmins.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-5 py-16 text-center">
                    <Users
                      size={30}
                      className="mx-auto mb-3 text-[#B0BDD1]"
                    />

                    <p className="text-sm font-bold text-[#344563]">
                      No administrators found
                    </p>

                    <p className="mt-1 text-xs text-[#8292B0]">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="border-t border-[#E5EAF3] px-5 py-4">
          <p className="text-[11px] text-[#8292B0]">
            Showing {filteredAdmins.length} of {totalAdmins} administrators
          </p>
        </div>
      </section>

      {/* Add / Edit Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAdmin(null);
        }}
        onSave={handleSaveAdmin}
        admin={selectedAdmin}
      />

      {/* Transfer Ownership Modal */}
      {transferOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071A3B]/50 p-4 backdrop-blur-[2px]"
          onClick={() => setTransferOpen(false)}
        >
          <div
            className="w-full max-w-[450px] rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Crown size={22} />
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#0B1C3B]">
                    Transfer Ownership
                  </h3>

                  <p className="mt-1 text-[11px] text-[#8292B0]">
                    Choose the new account owner.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setTransferOpen(false)}
                className="rounded-lg p-1 text-[#8292B0] hover:bg-gray-100"
              >
                <X size={19} />
              </button>
            </div>

            <div className="rounded-xl bg-[#F5F8FE] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8292B0]">
                Current Owner
              </p>

              <p className="mt-2 text-sm font-bold text-[#0B1C3B]">
                {owner?.name}
              </p>

              <p className="mt-1 text-xs text-[#8292B0]">
                {owner?.email}
              </p>
            </div>

            <div className="my-4">
              <label className="mb-2 block text-xs font-bold text-[#344563]">
                Select New Owner
              </label>

              <div className="relative">
                <select
                  value={newOwnerId}
                  onChange={(e) => setNewOwnerId(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-[#DFE7F5] bg-white px-4 py-3 pr-10 text-xs outline-none focus:border-[#246BFA]"
                >
                  <option value="">Choose an active admin</option>

                  {admins
                    .filter(
                      (admin) =>
                        !admin.isOwner &&
                        admin.status === "Active"
                    )
                    .map((admin) => (
                      <option key={admin.id} value={admin.id}>
                        {admin.name} ({admin.email})
                      </option>
                    ))}
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8292B0]"
                />
              </div>
            </div>

            <div className="mb-5 rounded-xl border border-amber-100 bg-amber-50 p-3">
              <p className="text-[11px] leading-5 text-amber-700">
                <strong>Important:</strong> The selected admin will
                become the owner with full access. The current owner
                will become a regular admin.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setTransferOpen(false)}
                className="rounded-xl border border-[#DFE7F5] px-4 py-3 text-xs font-bold text-[#344563] hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleTransferOwnership}
                disabled={!newOwnerId}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#246BFA] px-4 py-3 text-xs font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowRightLeft size={15} />
                Transfer Ownership
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
