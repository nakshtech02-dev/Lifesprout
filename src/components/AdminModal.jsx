
import { useEffect, useState } from "react";
import { X, ShieldCheck } from "lucide-react";
import {
  categories,
  availablePermissions,
} from "../data/adminData";

const AdminModal = ({ isOpen, onClose, onSave, admin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Admin",
    categories: [],
    permissions: [],
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(
        admin
          ? {
              name: admin.name,
              email: admin.email,
              role: admin.role,
              categories: admin.categories.filter(
                (item) => item !== "All Categories"
              ),
              permissions: [...admin.permissions],
            }
          : {
              name: "",
              email: "",
              role: "Admin",
              categories: [],
              permissions: [],
            }
      );
    }
  }, [admin, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleItem = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      return;
    }

    onSave(formData);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071A3B]/50 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-[600px] overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E5EAF3] bg-white px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-[#0B1C3B]">
              {admin ? "Edit Admin" : "Add New Admin"}
            </h2>

            <p className="mt-1 text-xs text-[#8292B0]">
              Manage admin details, categories and permissions.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#8292B0] transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Name */}
          <div>
            <label className="mb-2 block text-xs font-bold text-[#344563]">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter admin name"
              required
              className="w-full rounded-xl border border-[#DFE7F5] px-4 py-3 text-sm outline-none transition focus:border-[#246BFA] focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-xs font-bold text-[#344563]">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              required
              className="w-full rounded-xl border border-[#DFE7F5] px-4 py-3 text-sm outline-none transition focus:border-[#246BFA] focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Role */}
          <div>
            <label className="mb-2 block text-xs font-bold text-[#344563]">
              Admin Role
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#DFE7F5] bg-white px-4 py-3 text-sm outline-none focus:border-[#246BFA]"
            >
              <option value="Admin">Admin</option>
              <option value="Editor">Editor</option>
              <option value="Reviewer">Reviewer</option>
            </select>
          </div>

          {/* Categories */}
          <div>
            <div className="mb-3">
              <h3 className="text-xs font-bold text-[#344563]">
                Assign Blog Categories
              </h3>

              <p className="mt-1 text-[11px] text-[#8292B0]">
                Select the categories this admin will manage.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#E5EAF3] p-3 text-xs font-medium text-[#344563] transition hover:border-blue-300 hover:bg-blue-50/50"
                >
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(category)}
                    onChange={() =>
                      toggleItem("categories", category)
                    }
                    className="h-4 w-4 accent-[#246BFA]"
                  />

                  {category}
                </label>
              ))}
            </div>
          </div>

          {/* Permissions */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck size={17} className="text-[#246BFA]" />

              <h3 className="text-xs font-bold text-[#344563]">
                Admin Permissions
              </h3>
            </div>

            <div className="space-y-2">
              {availablePermissions.map((permission) => (
                <label
                  key={permission}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#E5EAF3] px-3 py-3 text-xs text-[#344563] hover:bg-blue-50/50"
                >
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(permission)}
                    onChange={() =>
                      toggleItem("permissions", permission)
                    }
                    className="h-4 w-4 accent-[#246BFA]"
                  />

                  {permission}
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-[#E5EAF3] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#DFE7F5] px-5 py-3 text-xs font-bold text-[#344563] transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-[#246BFA] px-5 py-3 text-xs font-bold text-white transition hover:bg-blue-700"
            >
              {admin ? "Save Changes" : "Create Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminModal;
