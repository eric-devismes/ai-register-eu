"use client";

/**
 * CustomersAdminClient — Unified CRM with two tabs:
 *   1. Customer Users — filterable table with inline editing
 *   2. Companies — enterprise subscribers with drill-down to users
 *
 * Features:
 *   - Stats row (Total Users, Free, Pro, Enterprise, Total Companies)
 *   - Inline editing with Save/Cancel
 *   - Toast notifications for save operations
 *   - Company drill-down shows member users (clickable to switch tab)
 *   - Add Company form
 */

import { useState, useCallback, useEffect } from "react";

/* ---------- Types ---------- */

interface Subscriber {
  id: string;
  email: string;
  name: string;
  verified: boolean;
  tier: string;
  role: string;
  industry: string;
  orgSize: string;
  platforms: string;
  digestEnabled: boolean;
  digestFrequency: string;
  stripeCustomerId: string | null;
  companyId: string | null;
  companyName: string | null;
  systems: string[];
  frameworks: string[];
  consentDate: string | null;
  createdAt: string;
  tierExpiresAt: string | null;
}

interface CompanySubscriber {
  id: string;
  email: string;
  name: string;
  tier: string;
  role: string;
}

interface Company {
  id: string;
  name: string;
  domain: string;
  industry: string;
  country: string;
  size: string;
  tier: string;
  notes: string;
  subscriberCount: number;
  caseCount: number;
  aiSystemCount: number;
  subscribers: CompanySubscriber[];
  createdAt: string;
}

/* ---------- Constants ---------- */

const TIER_BADGES: Record<string, string> = {
  free: "bg-gray-100 text-gray-600",
  pro: "bg-[#003399]/10 text-[#003399]",
  enterprise: "bg-purple-100 text-purple-700",
};

const ROLE_OPTIONS = [
  { value: "", label: "-- None --" },
  { value: "dpo", label: "DPO" },
  { value: "procurement", label: "Procurement" },
  { value: "cto", label: "CTO" },
  { value: "ciso", label: "CISO" },
  { value: "legal", label: "Legal" },
  { value: "executive", label: "Executive" },
  { value: "other", label: "Other" },
];

const INDUSTRY_OPTIONS = [
  { value: "", label: "-- None --" },
  { value: "financial", label: "Financial Services" },
  { value: "healthcare", label: "Healthcare" },
  { value: "insurance", label: "Insurance" },
  { value: "public-sector", label: "Public Sector" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "telecommunications", label: "Telecom" },
  { value: "energy", label: "Energy" },
  { value: "hr", label: "HR" },
  { value: "other", label: "Other" },
];

const ORG_SIZE_OPTIONS = [
  { value: "", label: "-- None --" },
  { value: "startup", label: "Startup" },
  { value: "sme", label: "SME" },
  { value: "enterprise", label: "Enterprise" },
  { value: "public-sector", label: "Public Sector" },
];

const TIER_OPTIONS = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
  { value: "enterprise", label: "Enterprise" },
];

const ROLE_LABELS: Record<string, string> = Object.fromEntries(
  ROLE_OPTIONS.filter((r) => r.value).map((r) => [r.value, r.label])
);

const INDUSTRY_LABELS: Record<string, string> = Object.fromEntries(
  INDUSTRY_OPTIONS.filter((r) => r.value).map((r) => [r.value, r.label])
);

const ORG_LABELS: Record<string, string> = Object.fromEntries(
  ORG_SIZE_OPTIONS.filter((r) => r.value).map((r) => [r.value, r.label])
);

/* ---------- Helpers ---------- */

function formatDate(iso: string | null): string {
  if (!iso) return "\u2014";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function TierBadge({ tier }: { tier: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${
        TIER_BADGES[tier] || TIER_BADGES.free
      }`}
    >
      {tier}
    </span>
  );
}

/* ---------- Toast ---------- */

function Toast({
  message,
  type,
  onDismiss,
}: {
  message: string;
  type: "success" | "error";
  onDismiss: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium shadow-lg transition-all ${
        type === "success"
          ? "bg-green-600 text-white"
          : "bg-red-600 text-white"
      }`}
    >
      {type === "success" ? (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 12.75 6 6 9-13.5"
          />
        </svg>
      ) : (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>
      )}
      {message}
      <button onClick={onDismiss} className="ml-2 opacity-70 hover:opacity-100">
        x
      </button>
    </div>
  );
}

/* ---------- Chevron icon ---------- */

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-4 w-4 text-gray-400 transition-transform ${
        open ? "rotate-180" : ""
      }`}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m19.5 8.25-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

/* ---------- Search icon ---------- */

function SearchIcon() {
  return (
    <svg
      className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
  );
}

/* ====================================================================
   MAIN COMPONENT
   ==================================================================== */

export function CustomersAdminClient({
  subscribers: initialSubscribers,
  companies: initialCompanies,
}: {
  subscribers: Subscriber[];
  companies: Company[];
}) {
  const [tab, setTab] = useState<"users" | "companies">("users");
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [companies, setCompanies] = useState(initialCompanies);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Cross-tab navigation: when clicking a user in company drill-down
  const [highlightUserId, setHighlightUserId] = useState<string | null>(null);

  const showToast = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      setToast({ message, type });
    },
    []
  );

  // Stats
  const totalUsers = subscribers.length;
  const freeCount = subscribers.filter((s) => s.tier === "free").length;
  const proCount = subscribers.filter((s) => s.tier === "pro").length;
  const entCount = subscribers.filter((s) => s.tier === "enterprise").length;
  const totalCompanies = companies.length;

  function navigateToUser(userId: string) {
    setTab("users");
    setHighlightUserId(userId);
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Customer Management
        </h1>
        <p className="text-sm text-gray-500">
          Manage subscribers and enterprise accounts
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Total Users</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{totalUsers}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Free</p>
          <p className="mt-1 text-2xl font-bold text-gray-600">{freeCount}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Pro</p>
          <p className="mt-1 text-2xl font-bold text-[#003399]">{proCount}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Enterprise</p>
          <p className="mt-1 text-2xl font-bold text-purple-600">{entCount}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Companies</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {totalCompanies}
          </p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setTab("users")}
          className={`px-5 py-3 text-sm font-semibold transition border-b-2 ${
            tab === "users"
              ? "border-[#003399] text-[#003399]"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Customer Users
        </button>
        <button
          onClick={() => setTab("companies")}
          className={`px-5 py-3 text-sm font-semibold transition border-b-2 ${
            tab === "companies"
              ? "border-[#003399] text-[#003399]"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Companies
        </button>
      </div>

      {/* Tab content */}
      {tab === "users" ? (
        <UsersTab
          subscribers={subscribers}
          setSubscribers={setSubscribers}
          companies={companies}
          showToast={showToast}
          highlightUserId={highlightUserId}
          clearHighlight={() => setHighlightUserId(null)}
        />
      ) : (
        <CompaniesTab
          companies={companies}
          setCompanies={setCompanies}
          showToast={showToast}
          navigateToUser={navigateToUser}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
}

/* ====================================================================
   USERS TAB
   ==================================================================== */

function UsersTab({
  subscribers,
  setSubscribers,
  companies,
  showToast,
  highlightUserId,
  clearHighlight,
}: {
  subscribers: Subscriber[];
  setSubscribers: React.Dispatch<React.SetStateAction<Subscriber[]>>;
  companies: Company[];
  showToast: (msg: string, type?: "success" | "error") => void;
  highlightUserId: string | null;
  clearHighlight: () => void;
}) {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(
    highlightUserId
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Subscriber>>({});
  const [saving, setSaving] = useState(false);

  // When highlightUserId changes, auto-expand that row
  useEffect(() => {
    if (highlightUserId) {
      setExpandedId(highlightUserId);
      setSearch("");
      setTierFilter("all");
      // Scroll after render
      setTimeout(() => {
        const el = document.getElementById(`user-row-${highlightUserId}`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        clearHighlight();
      }, 100);
    }
  }, [highlightUserId, clearHighlight]);

  const filtered = subscribers.filter((s) => {
    if (tierFilter !== "all" && s.tier !== tierFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return [s.email, s.name, s.role, s.industry, s.orgSize, s.companyName || ""]
        .join(" ")
        .toLowerCase()
        .includes(q);
    }
    return true;
  });

  function startEdit(sub: Subscriber) {
    setEditingId(sub.id);
    setEditForm({
      name: sub.name,
      email: sub.email,
      tier: sub.tier,
      role: sub.role,
      industry: sub.industry,
      orgSize: sub.orgSize,
      companyId: sub.companyId || "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({});
  }

  async function saveEdit(subId: string) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/subscribers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: subId, ...editForm }),
      });
      const data = await res.json();
      if (data.error) {
        showToast(data.error, "error");
        setSaving(false);
        return;
      }
      // Update local state
      setSubscribers((prev) =>
        prev.map((s) =>
          s.id === subId
            ? {
                ...s,
                ...editForm,
                companyName:
                  companies.find((c) => c.id === editForm.companyId)?.name ||
                  null,
              }
            : s
        )
      );
      setEditingId(null);
      setEditForm({});
      showToast("User updated successfully");
    } catch {
      showToast("Failed to save changes", "error");
    }
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      {/* Filters row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <SearchIcon />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, role, industry..."
            className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2.5 text-sm focus:border-[#003399] focus:outline-none focus:ring-1 focus:ring-[#003399]"
          />
        </div>
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-[#003399] focus:outline-none"
        >
          <option value="all">All tiers</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="enterprise">Enterprise</option>
        </select>
      </div>

      <p className="text-xs text-gray-400">
        {filtered.length} result{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No users match your filters.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Tier</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Industry</th>
                <th className="px-4 py-3 text-left">Company</th>
                <th className="px-4 py-3 text-left">Registered</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((sub) => {
                const isExpanded = expandedId === sub.id;
                const isEditing = editingId === sub.id;
                const isHighlighted = highlightUserId === sub.id;
                return (
                  <UserRow
                    key={sub.id}
                    sub={sub}
                    isExpanded={isExpanded}
                    isEditing={isEditing}
                    isHighlighted={isHighlighted}
                    editForm={editForm}
                    setEditForm={setEditForm}
                    saving={saving}
                    companies={companies}
                    onToggle={() =>
                      setExpandedId(isExpanded ? null : sub.id)
                    }
                    onStartEdit={() => startEdit(sub)}
                    onCancelEdit={cancelEdit}
                    onSave={() => saveEdit(sub.id)}
                  />
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ---------- User Row ---------- */

function UserRow({
  sub,
  isExpanded,
  isEditing,
  isHighlighted,
  editForm,
  setEditForm,
  saving,
  companies,
  onToggle,
  onStartEdit,
  onCancelEdit,
  onSave,
}: {
  sub: Subscriber;
  isExpanded: boolean;
  isEditing: boolean;
  isHighlighted: boolean;
  editForm: Partial<Subscriber>;
  setEditForm: React.Dispatch<React.SetStateAction<Partial<Subscriber>>>;
  saving: boolean;
  companies: Company[];
  onToggle: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: () => void;
}) {
  return (
    <>
      <tr
        id={`user-row-${sub.id}`}
        className={`cursor-pointer transition ${
          isHighlighted
            ? "bg-yellow-50"
            : isExpanded
            ? "bg-blue-50/30"
            : "hover:bg-gray-50"
        }`}
        onClick={onToggle}
      >
        <td className="px-4 py-3">
          <span className="font-medium text-gray-900">
            {sub.name || "\u2014"}
          </span>
          {!sub.verified && (
            <span className="ml-1 text-[10px] text-red-400">unverified</span>
          )}
        </td>
        <td className="px-4 py-3 text-gray-600">{sub.email}</td>
        <td className="px-4 py-3">
          <TierBadge tier={sub.tier} />
        </td>
        <td className="px-4 py-3 text-xs text-gray-600">
          {ROLE_LABELS[sub.role] || sub.role || "\u2014"}
        </td>
        <td className="px-4 py-3 text-xs text-gray-600">
          {INDUSTRY_LABELS[sub.industry] || sub.industry || "\u2014"}
        </td>
        <td className="px-4 py-3 text-xs text-gray-600">
          {sub.companyName || "\u2014"}
        </td>
        <td className="px-4 py-3 text-xs text-gray-400">
          {formatDate(sub.createdAt)}
        </td>
        <td className="px-4 py-3">
          <ChevronDown open={isExpanded} />
        </td>
      </tr>

      {/* Expanded panel */}
      {isExpanded && (
        <tr>
          <td colSpan={8} className="bg-gray-50/60 px-4 py-4">
            {isEditing ? (
              /* ---- EDIT MODE ---- */
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-gray-500 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name || ""}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:border-[#003399] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-gray-500 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editForm.email || ""}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, email: e.target.value }))
                      }
                      className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:border-[#003399] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-gray-500 mb-1">
                      Tier
                    </label>
                    <select
                      value={editForm.tier || "free"}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, tier: e.target.value }))
                      }
                      className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:border-[#003399] focus:outline-none"
                    >
                      {TIER_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-gray-500 mb-1">
                      Role
                    </label>
                    <select
                      value={editForm.role || ""}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, role: e.target.value }))
                      }
                      className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:border-[#003399] focus:outline-none"
                    >
                      {ROLE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-gray-500 mb-1">
                      Industry
                    </label>
                    <select
                      value={editForm.industry || ""}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          industry: e.target.value,
                        }))
                      }
                      className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:border-[#003399] focus:outline-none"
                    >
                      {INDUSTRY_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-gray-500 mb-1">
                      Org Size
                    </label>
                    <select
                      value={editForm.orgSize || ""}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          orgSize: e.target.value,
                        }))
                      }
                      className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:border-[#003399] focus:outline-none"
                    >
                      {ORG_SIZE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-gray-500 mb-1">
                      Company
                    </label>
                    <select
                      value={editForm.companyId || ""}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          companyId: e.target.value,
                        }))
                      }
                      className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:border-[#003399] focus:outline-none"
                    >
                      <option value="">-- No company --</option>
                      {companies.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSave();
                    }}
                    disabled={saving}
                    className="rounded-lg bg-[#003399] px-4 py-2 text-xs font-semibold text-white hover:bg-[#002277] disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCancelEdit();
                    }}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-xs text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* ---- READ MODE ---- */
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-xs">
                  <div>
                    <p className="font-semibold text-gray-500 uppercase">
                      Org Size
                    </p>
                    <p className="mt-0.5 text-gray-700">
                      {ORG_LABELS[sub.orgSize] || sub.orgSize || "\u2014"}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-500 uppercase">
                      Digest
                    </p>
                    <p className="mt-0.5 text-gray-700">
                      {sub.digestEnabled ? sub.digestFrequency : "Off"}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-500 uppercase">
                      Consent Date
                    </p>
                    <p className="mt-0.5 text-gray-700">
                      {formatDate(sub.consentDate)}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-500 uppercase">
                      Tier Expires
                    </p>
                    <p className="mt-0.5 text-gray-700">
                      {formatDate(sub.tierExpiresAt)}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-500 uppercase">
                      Stripe ID
                    </p>
                    <p className="mt-0.5 text-gray-700 truncate">
                      {sub.stripeCustomerId || "\u2014"}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-500 uppercase">
                      Platform
                    </p>
                    <p className="mt-0.5 text-gray-700">
                      {sub.platforms || "\u2014"}
                    </p>
                  </div>
                </div>

                {sub.systems.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                      AI Systems Followed
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {sub.systems.map((s) => (
                        <span
                          key={s}
                          className="rounded bg-blue-50 px-2 py-0.5 text-[10px] text-blue-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {sub.frameworks.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                      Frameworks Followed
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {sub.frameworks.map((f) => (
                        <span
                          key={f}
                          className="rounded bg-purple-50 px-2 py-0.5 text-[10px] text-purple-700"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Edit button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartEdit();
                  }}
                  className="mt-2 rounded-lg border border-[#003399] px-4 py-1.5 text-xs font-semibold text-[#003399] hover:bg-[#003399]/5"
                >
                  Edit User
                </button>
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

/* ====================================================================
   COMPANIES TAB
   ==================================================================== */

function CompaniesTab({
  companies,
  setCompanies,
  showToast,
  navigateToUser,
}: {
  companies: Company[];
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
  showToast: (msg: string, type?: "success" | "error") => void;
  navigateToUser: (userId: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Company>>({});
  const [saving, setSaving] = useState(false);

  // Add company form
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    domain: "",
    industry: "",
    country: "",
    size: "",
    tier: "free",
    notes: "",
  });
  const [addLoading, setAddLoading] = useState(false);

  const filtered = companies.filter((c) => {
    if (tierFilter !== "all" && c.tier !== tierFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return [c.name, c.domain, c.industry, c.country, c.tier]
        .join(" ")
        .toLowerCase()
        .includes(q);
    }
    return true;
  });

  function startEdit(company: Company) {
    setEditingId(company.id);
    setEditForm({
      name: company.name,
      domain: company.domain,
      industry: company.industry,
      country: company.country,
      size: company.size,
      tier: company.tier,
      notes: company.notes,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({});
  }

  async function saveEdit(companyId: string) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/companies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: companyId, ...editForm }),
      });
      const data = await res.json();
      if (data.error) {
        showToast(data.error, "error");
        setSaving(false);
        return;
      }
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === companyId ? { ...c, ...editForm } as Company : c
        )
      );
      setEditingId(null);
      setEditForm({});
      showToast("Company updated successfully");
    } catch {
      showToast("Failed to save changes", "error");
    }
    setSaving(false);
  }

  async function handleAddCompany(e: React.FormEvent) {
    e.preventDefault();
    if (!addForm.name) return;
    setAddLoading(true);
    try {
      const res = await fetch("/api/admin/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      const data = await res.json();
      if (data.error) {
        showToast(data.error, "error");
        setAddLoading(false);
        return;
      }
      setCompanies((prev) => [
        ...prev,
        { ...data.company, subscribers: [], subscriberCount: 0, caseCount: 0, aiSystemCount: 0 },
      ]);
      setAddForm({
        name: "",
        domain: "",
        industry: "",
        country: "",
        size: "",
        tier: "free",
        notes: "",
      });
      setShowAdd(false);
      showToast("Company created successfully");
    } catch {
      showToast("Failed to create company", "error");
    }
    setAddLoading(false);
  }

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-3">
          <div className="relative flex-1">
            <SearchIcon />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, domain, industry, country..."
              className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2.5 text-sm focus:border-[#003399] focus:outline-none focus:ring-1 focus:ring-[#003399]"
            />
          </div>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-[#003399] focus:outline-none"
          >
            <option value="all">All tiers</option>
            <option value="free">Free</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="rounded-lg bg-[#003399] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#002277]"
        >
          + Add Company
        </button>
      </div>

      {/* Add company form */}
      {showAdd && (
        <form
          onSubmit={handleAddCompany}
          className="rounded-xl border border-gray-200 bg-white p-5 space-y-3"
        >
          <p className="text-sm font-semibold text-gray-700">New Company</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <input
              type="text"
              value={addForm.name}
              onChange={(e) =>
                setAddForm({ ...addForm, name: e.target.value })
              }
              placeholder="Company name *"
              required
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#003399] focus:outline-none"
            />
            <input
              type="text"
              value={addForm.domain}
              onChange={(e) =>
                setAddForm({ ...addForm, domain: e.target.value })
              }
              placeholder="Domain (e.g. company.eu)"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#003399] focus:outline-none"
            />
            <input
              type="text"
              value={addForm.country}
              onChange={(e) =>
                setAddForm({ ...addForm, country: e.target.value })
              }
              placeholder="Country"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#003399] focus:outline-none"
            />
            <select
              value={addForm.industry}
              onChange={(e) =>
                setAddForm({ ...addForm, industry: e.target.value })
              }
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#003399] focus:outline-none"
            >
              <option value="">Industry</option>
              {INDUSTRY_OPTIONS.filter((o) => o.value).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <select
              value={addForm.size}
              onChange={(e) =>
                setAddForm({ ...addForm, size: e.target.value })
              }
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#003399] focus:outline-none"
            >
              <option value="">Company size</option>
              {ORG_SIZE_OPTIONS.filter((o) => o.value).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <select
              value={addForm.tier}
              onChange={(e) =>
                setAddForm({ ...addForm, tier: e.target.value })
              }
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#003399] focus:outline-none"
            >
              {TIER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={addForm.notes}
            onChange={(e) =>
              setAddForm({ ...addForm, notes: e.target.value })
            }
            placeholder="Internal notes..."
            rows={2}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#003399] focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={addLoading}
              className="rounded-lg bg-[#003399] px-4 py-2 text-sm font-semibold text-white hover:bg-[#002277] disabled:opacity-50"
            >
              {addLoading ? "Creating..." : "Create Company"}
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <p className="text-xs text-gray-400">
        {filtered.length} result{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No companies match your filters.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Company</th>
                <th className="px-4 py-3 text-left">Domain</th>
                <th className="px-4 py-3 text-left">Industry</th>
                <th className="px-4 py-3 text-left">Country</th>
                <th className="px-4 py-3 text-left">Tier</th>
                <th className="px-4 py-3 text-left">Users</th>
                <th className="px-4 py-3 text-left">Cases</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((company) => {
                const isExpanded = expandedId === company.id;
                const isEditing = editingId === company.id;
                return (
                  <CompanyRow
                    key={company.id}
                    company={company}
                    isExpanded={isExpanded}
                    isEditing={isEditing}
                    editForm={editForm}
                    setEditForm={setEditForm}
                    saving={saving}
                    onToggle={() =>
                      setExpandedId(isExpanded ? null : company.id)
                    }
                    onStartEdit={() => startEdit(company)}
                    onCancelEdit={cancelEdit}
                    onSave={() => saveEdit(company.id)}
                    navigateToUser={navigateToUser}
                  />
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ---------- Company Row ---------- */

function CompanyRow({
  company,
  isExpanded,
  isEditing,
  editForm,
  setEditForm,
  saving,
  onToggle,
  onStartEdit,
  onCancelEdit,
  onSave,
  navigateToUser,
}: {
  company: Company;
  isExpanded: boolean;
  isEditing: boolean;
  editForm: Partial<Company>;
  setEditForm: React.Dispatch<React.SetStateAction<Partial<Company>>>;
  saving: boolean;
  onToggle: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: () => void;
  navigateToUser: (userId: string) => void;
}) {
  return (
    <>
      <tr
        className={`cursor-pointer transition ${
          isExpanded ? "bg-blue-50/30" : "hover:bg-gray-50"
        }`}
        onClick={onToggle}
      >
        <td className="px-4 py-3 font-medium text-gray-900">{company.name}</td>
        <td className="px-4 py-3 text-xs text-gray-500">
          {company.domain || "\u2014"}
        </td>
        <td className="px-4 py-3 text-xs text-gray-600">
          {INDUSTRY_LABELS[company.industry] || company.industry || "\u2014"}
        </td>
        <td className="px-4 py-3 text-xs text-gray-600">
          {company.country || "\u2014"}
        </td>
        <td className="px-4 py-3">
          <TierBadge tier={company.tier} />
        </td>
        <td className="px-4 py-3 text-xs text-gray-600">
          {company.subscriberCount}
        </td>
        <td className="px-4 py-3 text-xs text-gray-600">
          {company.caseCount}
        </td>
        <td className="px-4 py-3">
          <ChevronDown open={isExpanded} />
        </td>
      </tr>

      {/* Expanded panel */}
      {isExpanded && (
        <tr>
          <td colSpan={8} className="bg-gray-50/60 px-4 py-4">
            {isEditing ? (
              /* ---- EDIT MODE ---- */
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-gray-500 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={(editForm.name as string) || ""}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:border-[#003399] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-gray-500 mb-1">
                      Domain
                    </label>
                    <input
                      type="text"
                      value={(editForm.domain as string) || ""}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, domain: e.target.value }))
                      }
                      className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:border-[#003399] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-gray-500 mb-1">
                      Industry
                    </label>
                    <select
                      value={(editForm.industry as string) || ""}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          industry: e.target.value,
                        }))
                      }
                      className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:border-[#003399] focus:outline-none"
                    >
                      {INDUSTRY_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-gray-500 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={(editForm.country as string) || ""}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          country: e.target.value,
                        }))
                      }
                      className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:border-[#003399] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-gray-500 mb-1">
                      Size
                    </label>
                    <select
                      value={(editForm.size as string) || ""}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, size: e.target.value }))
                      }
                      className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:border-[#003399] focus:outline-none"
                    >
                      {ORG_SIZE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-gray-500 mb-1">
                      Tier
                    </label>
                    <select
                      value={(editForm.tier as string) || "free"}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, tier: e.target.value }))
                      }
                      className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:border-[#003399] focus:outline-none"
                    >
                      {TIER_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase text-gray-500 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={(editForm.notes as string) || ""}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, notes: e.target.value }))
                    }
                    rows={2}
                    className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:border-[#003399] focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSave();
                    }}
                    disabled={saving}
                    className="rounded-lg bg-[#003399] px-4 py-2 text-xs font-semibold text-white hover:bg-[#002277] disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCancelEdit();
                    }}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-xs text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* ---- READ MODE ---- */
              <div className="space-y-3">
                {company.notes && (
                  <p className="text-xs text-gray-600 italic">
                    {company.notes}
                  </p>
                )}

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <p className="font-semibold text-gray-500 uppercase">
                      Size
                    </p>
                    <p className="mt-0.5 text-gray-700">
                      {ORG_LABELS[company.size] || company.size || "\u2014"}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-500 uppercase">
                      AI Systems
                    </p>
                    <p className="mt-0.5 text-gray-700">
                      {company.aiSystemCount}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-500 uppercase">
                      Created
                    </p>
                    <p className="mt-0.5 text-gray-700">
                      {formatDate(company.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Drill-down: users belonging to this company */}
                {company.subscribers.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      Users ({company.subscriberCount})
                    </p>
                    <div className="space-y-1">
                      {company.subscribers.map((s) => (
                        <button
                          key={s.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToUser(s.id);
                          }}
                          className="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-xs hover:border-[#003399]/30 hover:bg-blue-50/30 transition"
                        >
                          <span className="font-medium text-gray-900">
                            {s.name || s.email}
                          </span>
                          {s.name && (
                            <span className="text-gray-400">{s.email}</span>
                          )}
                          <span className="ml-auto">
                            <TierBadge tier={s.tier} />
                          </span>
                          <span className="text-gray-400">
                            {ROLE_LABELS[s.role] || s.role || ""}
                          </span>
                          <svg
                            className="h-3 w-3 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                            />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Edit button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartEdit();
                  }}
                  className="mt-2 rounded-lg border border-[#003399] px-4 py-1.5 text-xs font-semibold text-[#003399] hover:bg-[#003399]/5"
                >
                  Edit Company
                </button>
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}
