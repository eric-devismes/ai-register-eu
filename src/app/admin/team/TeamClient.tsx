"use client";

/**
 * AdminTeamClient — Interactive admin team management.
 *
 * Shows table of all admin users with role badges, status, and actions.
 * Supports adding new admins and toggling active/inactive.
 */

import { useState } from "react";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  active: boolean;
  totpEnabled: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

const ROLE_BADGES: Record<string, { bg: string; text: string }> = {
  owner: { bg: "bg-purple-100", text: "text-purple-700" },
  admin: { bg: "bg-blue-100", text: "text-blue-700" },
  editor: { bg: "bg-gray-100", text: "text-gray-700" },
};

export function AdminTeamClient({
  admins: initialAdmins,
  currentAdminId,
}: {
  admins: AdminUser[];
  currentAdminId: string;
}) {
  const [admins, setAdmins] = useState(initialAdmins);
  const [showAdd, setShowAdd] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("editor");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail || !newPassword) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, name: newName, password: newPassword, role: newRole }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); setLoading(false); return; }

      setAdmins((prev) => [...prev, data.admin]);
      setNewEmail("");
      setNewName("");
      setNewPassword("");
      setNewRole("editor");
      setShowAdd(false);
    } catch {
      setError("Failed to add admin");
    }
    setLoading(false);
  }

  async function toggleActive(id: string, active: boolean) {
    try {
      const res = await fetch("/api/admin/team", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active: !active }),
      });
      const data = await res.json();
      if (data.error) return;
      setAdmins((prev) => prev.map((a) => (a.id === id ? { ...a, active: !active } : a)));
    } catch {
      // silently fail
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
      )}

      {/* Admin table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 border-b">
            <tr>
              <th className="px-5 py-3 text-left">User</th>
              <th className="px-5 py-3 text-left">Role</th>
              <th className="px-5 py-3 text-left">2FA</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-left">Last login</th>
              <th className="px-5 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {admins.map((admin) => {
              const badge = ROLE_BADGES[admin.role] || ROLE_BADGES.editor;
              const isSelf = admin.id === currentAdminId;
              return (
                <tr key={admin.id} className={!admin.active ? "opacity-50" : ""}>
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900">
                      {admin.name || admin.email}
                      {isSelf && <span className="ml-1 text-xs text-gray-400">(you)</span>}
                    </p>
                    <p className="text-xs text-gray-500">{admin.email}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.bg} ${badge.text}`}>
                      {admin.role}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs ${admin.totpEnabled ? "text-green-600" : "text-gray-400"}`}>
                      {admin.totpEnabled ? "Enabled" : "Off"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-block h-2 w-2 rounded-full ${admin.active ? "bg-green-500" : "bg-gray-300"}`} />
                    <span className="ml-1.5 text-xs text-gray-600">{admin.active ? "Active" : "Inactive"}</span>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-400">
                    {admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleDateString("en-GB") : "Never"}
                  </td>
                  <td className="px-5 py-3">
                    {!isSelf && admin.role !== "owner" && (
                      <button
                        onClick={() => toggleActive(admin.id, admin.active)}
                        className="text-xs text-gray-500 hover:text-gray-800 underline"
                      >
                        {admin.active ? "Deactivate" : "Activate"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add admin form */}
      {!showAdd ? (
        <button
          onClick={() => setShowAdd(true)}
          className="rounded-lg bg-[#003399] px-4 py-2 text-sm font-semibold text-white hover:bg-[#002277]"
        >
          + Add team member
        </button>
      ) : (
        <form onSubmit={handleAdd} className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
          <h3 className="font-semibold text-gray-900">Add admin user</h3>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Email"
              required
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Name"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Password"
              required
              minLength={8}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#003399] px-4 py-2 text-sm font-semibold text-white hover:bg-[#002277] disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add"}
            </button>
            <button
              type="button"
              onClick={() => { setShowAdd(false); setError(""); }}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
