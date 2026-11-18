
import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  Camera,
  Edit,
  Save,
  X,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const PROFILE_KEY = "lifesprout_owner_profile";

const defaultProfile = {
  fullName: "Lifesprout Care Owner",
  email: "",
  phone: "",
  company: "Lifesprout Care",
  jobTitle: "Owner",
  address: "",
  bio: "",
  profileImage: "",
};

const getSavedProfile = () => {
  try {
    const saved = localStorage.getItem(PROFILE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return { ...defaultProfile, ...parsed };
      }
    }
  } catch (error) {
    console.error("Unable to load profile:", error);
  }

  return defaultProfile;
};

const MyProfile = () => {
  const [profile, setProfile] = useState(getSavedProfile);
  const [originalProfile, setOriginalProfile] = useState(getSavedProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setOriginalProfile({ ...profile });
    setProfileMessage("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setProfile({ ...originalProfile });
    setIsEditing(false);
    setProfileMessage("");
  };

  const handleSaveProfile = (event) => {
    event.preventDefault();

    if (!profile.fullName.trim()) {
      setProfileMessage("Please enter your full name.");
      return;
    }

    if (
      profile.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)
    ) {
      setProfileMessage("Please enter a valid email address.");
      return;
    }

    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      setOriginalProfile({ ...profile });
      setIsEditing(false);
      setProfileMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Unable to save profile:", error);
      setProfileMessage("Unable to save your profile in this browser.");
    }
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setPasswordError("");
    setPasswordMessage("");
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must contain at least 8 characters.");
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError(
        "Your new password must be different from your current password."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    setPasswordMessage(
      "Password validation successful. Connect backend authentication to update your actual password."
    );

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 disabled:text-gray-500";

  const fieldLabel =
    "mb-2 block text-sm font-medium text-gray-700";

  const PasswordInput = ({
    label,
    name,
    value,
    visible,
    onToggle,
  }) => (
    <div>
      <label className={fieldLabel}>{label}</label>

      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={handlePasswordChange}
          placeholder={`Enter ${label.toLowerCase()}`}
          className={`${inputClass} pr-12`}
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <span>Account</span>
            <span>/</span>
            <span className="text-blue-600">My Profile</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-800">
            My Profile
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your personal information and account settings.
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Edit size={17} />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              <X size={17} />
              Cancel
            </button>

            <button
              form="profile-form"
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Save size={17} />
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Profile Message */}
      {profileMessage && (
        <div
          className={`flex items-center gap-2 rounded-xl border p-4 text-sm ${
            profileMessage.includes("successfully")
              ? "border-green-100 bg-green-50 text-green-700"
              : "border-red-100 bg-red-50 text-red-600"
          }`}
        >
          {profileMessage.includes("successfully") ? (
            <CheckCircle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          {profileMessage}
        </div>
      )}

      {/* Profile Overview */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="h-32 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-500" />

        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="relative h-24 w-24 shrink-0">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-blue-50 text-blue-600 shadow-sm">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt="Profile"
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <User size={42} />
                )}
              </div>

              {isEditing && (
                <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white">
                  <Camera size={15} />
                </div>
              )}
            </div>

            <div className="pb-1 sm:flex-1 sm:pl-2">
              <h2 className="text-xl font-bold text-gray-800">
                {profile.fullName || "Your Name"}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {profile.jobTitle || "Owner"} · {profile.company}
              </p>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
              <ShieldCheck size={15} />
              Owner Account
            </span>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <form
            id="profile-form"
            onSubmit={handleSaveProfile}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800">
                Personal Information
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Your personal and contact details.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={fieldLabel}>Full Name *</label>
                <div className="relative">
                  <User
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    placeholder="Enter your full name"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className={fieldLabel}>Email Address</label>
                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    placeholder="Enter email address"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className={fieldLabel}>Phone Number</label>
                <div className="relative">
                  <Phone
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    placeholder="Enter phone number"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className={fieldLabel}>Company</label>
                <div className="relative">
                  <Building2
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    name="company"
                    value={profile.company}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    placeholder="Company name"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className={fieldLabel}>Job Title</label>
                <div className="relative">
                  <Briefcase
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    name="jobTitle"
                    value={profile.jobTitle}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    placeholder="Your job title"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className={fieldLabel}>Address</label>
                <div className="relative">
                  <MapPin
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    name="address"
                    value={profile.address}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    placeholder="Enter your address"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className={fieldLabel}>Profile Image URL</label>
                <div className="relative">
                  <Camera
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    name="profileImage"
                    value={profile.profileImage}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    placeholder="https://example.com/profile.jpg"
                    className={`${inputClass} pl-10`}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  Paste a publicly accessible image URL to display your
                  profile photo.
                </p>
              </div>

              <div className="sm:col-span-2">
                <label className={fieldLabel}>About Me</label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  rows={4}
                  placeholder="Write a short introduction about yourself..."
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 flex justify-end border-t border-gray-100 pt-5">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Save size={17} />
                  Save Profile
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Account Information */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800">
              Account Information
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Your dashboard account details.
            </p>

            <div className="mt-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ShieldCheck size={19} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Account Role</p>
                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    Owner
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <CheckCircle size={19} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Account Status</p>
                  <p className="mt-1 text-sm font-semibold text-green-600">
                    Active
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <Building2 size={19} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Organization</p>
                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    Lifesprout Care
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600">
              <ShieldCheck size={20} />
            </div>

            <h3 className="mt-4 font-bold text-gray-800">
              Keep your account secure
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Use a strong password and enable OTP verification to help protect
              your dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <Lock size={21} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Change Password
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Update your account password.
            </p>
          </div>
        </div>

        {passwordError && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
            <AlertCircle size={17} />
            {passwordError}
          </div>
        )}

        {passwordMessage && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
            <AlertCircle size={17} className="mt-0.5 shrink-0" />
            {passwordMessage}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit}>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <PasswordInput
              label="Current Password"
              name="currentPassword"
              value={passwordData.currentPassword}
              visible={showCurrentPassword}
              onToggle={() =>
                setShowCurrentPassword((previous) => !previous)
              }
            />

            <PasswordInput
              label="New Password"
              name="newPassword"
              value={passwordData.newPassword}
              visible={showNewPassword}
              onToggle={() =>
                setShowNewPassword((previous) => !previous)
              }
            />

            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              visible={showConfirmPassword}
              onToggle={() =>
                setShowConfirmPassword((previous) => !previous)
              }
            />
          </div>

          <div className="mt-5 flex flex-col justify-between gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center">
            <p className="text-xs text-gray-400">
              Use at least 8 characters for your new password.
            </p>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-gray-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-900"
            >
              <Lock size={16} />
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;
