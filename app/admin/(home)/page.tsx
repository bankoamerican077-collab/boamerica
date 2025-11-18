'use client';

import { useEffect, useState } from "react";
import { Plus, Edit2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { customAlphabet, nanoid } from "nanoid";

import { storeTransactionDocumentData, updateDocumentByRefId } from "@/lib/firebaseUtils";
import { getAllTransactionHistory } from "@/lib/firebaseUtils"; // <-- fetch function (must read from "transactions")
import { TransactionType } from "@/lib/firebaseUtils";

// --- Small UI helpers (kept inline like your original) ---
const Card = ({ children, className = "" }: any) => (
  <div className={`bg-white rounded-lg border shadow-sm ${className}`}>{children}</div>
);

// Simple native select used in your original
const NativeSelect = ({ value, onChange, options, placeholder }: any) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 appearance-none"
    >
      <option value="">{placeholder}</option>
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  </div>
);

// --- Loading Spinner Component ---
function Spinner({ size = 36 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center">
      <svg
        style={{ width: size, height: size }}
        className="animate-spin"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
    </div>
  );
}

// --- Main Component ---
export default function AdminTransactionsDashboard() {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState<"new" | "edit">("new");
  const random12 = customAlphabet("0123456789", 12);
  const [loading, setLoading] = useState(true); // initial load
  const [saving, setSaving] = useState(false); // saving animation

  // Form state
  const [formData, setFormData] = useState<any>({
    refId: "",
    accountId: "",
    date: "",
    merchant: "",
    description: "",
    category: "",
    amount: "",
    type: "credit",
    status: "completed",
  });

  // Fetch all transactions on mount
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await getAllTransactionHistory(); // expects to read from "transactions"
        if (mounted) {
          // Ensure data is sorted newest first (optional)
          const sorted = Array.isArray(data)
            ? data.sort((a: any, b: any) => (new Date(b.date).getTime() - new Date(a.date).getTime()))
            : [];
          setTransactions(sorted);
        }
      } catch (err) {
        console.error("Error loading transactions:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  // Balance calculation
  const totalBalance = transactions.reduce((acc, tx) => {
    if (tx.type === "credit") return acc + Number(tx.amount);
    if (tx.type === "debit") return acc - Number(tx.amount);
    return acc;
  }, 0);

  // Open new form
  const openNewForm = () => {
    setMode("new");
    setFormData({
      refId: "",
      accountId: "",
      date: new Date().toISOString().split("T")[0],
      merchant: "",
      description: "",
      category: "",
      amount: "",
      type: "credit",
      status: "completed",
    });
    setShowForm(true);
  };

  // Open edit form
  const openEditForm = (tx: TransactionType) => {
    setMode("edit");
    setFormData({
      ...tx,
      refId: tx.refId ?? tx.refId, // keep refId
      description: tx.description || "",
      amount: tx.amount,
    });
    setShowForm(true);
  };

  // Save (new or edit)
  const handleSave = async () => {
    // basic validation
    if (!formData.amount || Number(formData.amount) <= 0) {
      alert("Enter a valid amount.");
      return;
    }
    if (!formData.date || !formData.merchant || !formData.category) {
      alert("Fill all required fields.");
      return;
    }

    const normalizedNew: TransactionType = {
      refId: nanoid(21),
      accountId: formData.accountId || "acc-1",
      transactionId: Number(random12()),
      date: `${formData.date}`,
      merchant: formData.merchant,
      description: formData.description || "",
      category: formData.category,
      amount: Number(formData.amount),
      type: formData.type,
      status: formData.status,
    };

    const normalizedUpdated: TransactionType = {
      refId: formData.refId || nanoid(21),
      accountId: formData.accountId || "acc-1",
      transactionId: Number(random12()),
      date: `${formData.date}`,
      merchant: formData.merchant,
      description: formData.description || "",
      category: formData.category,
      amount: Number(formData.amount),
      type: formData.type,
      status: formData.status,
    };

    try {
      setSaving(true);

      if (mode === "new") {
        // optimistic UI update
        setTransactions((prev) => [normalizedNew, ...prev]);

        // store in Firestore
        const documentRef = await storeTransactionDocumentData(normalizedNew);
        if (documentRef) {
          console.log("Document added successfully:", documentRef);
        } else {
          console.warn("storeTransactionDocumentData returned falsy value.");
        }
      } else {
        // update locally
        setTransactions((prev) =>
          prev.map((t) => (t.refId === formData.refId ? normalizedUpdated : t))
        );

        // update Firestore (collection 'transactions')
        const updated = await updateDocumentByRefId("transactions", formData.refId, normalizedUpdated);
        if (updated) {
          console.log("Document updated successfully");
        } else {
          console.warn("updateDocumentByRefId returned falsy value.");
        }
      }
    } catch (error) {
      console.error("error storing transaction:", error);
      alert("There was an error saving the transaction. Check console for details.");
    } finally {
      setSaving(false);
      setShowForm(false);
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header + Balance */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-blue-800">Admin Transactions</h1>
            <p className="text-lg font-medium text-slate-600 mt-1">
              Total Balance:{" "}
              <span className={totalBalance >= 0 ? "text-emerald-600" : "text-red-600"}>
                ${totalBalance.toFixed(2)}
              </span>
            </p>
          </div>

          <Button onClick={openNewForm} className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add New Transaction
          </Button>
        </div>

        {/* LOADING */}
        {loading && (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <Spinner size={48} />
              <p className="text-slate-500">Loading transactions...</p>
            </div>
          </Card>
        )}

        {/* Desktop table */}
        {!loading && transactions.length > 0 && (
          <Card className="hidden lg:block bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="text-left p-4 font-semibold text-slate-700">Date</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Merchant & Description</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Category</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Status</th>
                    <th className="text-right p-4 font-semibold text-slate-700">Amount</th>
                    <th className="text-right p-4 font-semibold text-slate-700">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {transactions.map((tx) => (
                    <tr key={tx.refId} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 whitespace-nowrap text-slate-600">
                        {new Date(tx.date).toLocaleDateString()}
                      </td>

                      <td className="p-4">
                        <div className="font-medium text-slate-900">{tx.merchant}</div>
                        {tx.description && (
                          <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{tx.description}</div>
                        )}
                      </td>

                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          {tx.category}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              tx.status === "completed" ? "bg-emerald-500" : tx.status === "pending" ? "bg-amber-500" : "bg-red-500"
                            }`}
                          />
                          <span className="capitalize text-slate-700">{tx.status}</span>
                        </div>
                      </td>

                      <td
                        className={`p-4 text-right font-semibold ${
                          tx.type === "debit" ? "text-red-600" : "text-emerald-600"
                        }`}
                      >
                        {tx.type === "debit" ? "-" : "+"}${Number(tx.amount).toFixed(2)}
                      </td>

                      <td className="p-4 text-right">
                        <Button size="sm" variant="ghost" onClick={() => openEditForm(tx)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Mobile cards */}
        {!loading && transactions.length > 0 && (
          <div className="lg:hidden space-y-3">
            {transactions.map((tx) => (
              <Card key={tx.refId} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">{new Date(tx.date).toLocaleDateString()}</p>
                    <p className="font-semibold text-slate-900">{tx.merchant}</p>
                    {tx.description && <p className="text-xs text-slate-500 mt-0.5 italic">{tx.description}</p>}
                  </div>
                  <p className={`font-semibold text-lg ${tx.type === "debit" ? "text-red-600" : "text-emerald-600"}`}>
                    {tx.type === "debit" ? "-" : "+"}${Number(tx.amount).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                      {tx.category}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                        tx.status === "completed" ? "border-emerald-200 text-emerald-700 bg-emerald-50" : tx.status === "pending" ? "border-amber-200 text-amber-700 bg-amber-50" : "border-red-200 text-red-700 bg-red-50"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>

                  <Button size="sm" variant="outline" onClick={() => openEditForm(tx)}>
                    Edit
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && transactions.length === 0 && (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center justify-center text-slate-500">
              <Filter className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium">No transactions found</p>
              <p className="text-sm">Get started by adding a new transaction.</p>
            </div>
          </Card>
        )}

        {/* FORM MODAL */}
        {showForm && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-xl font-semibold text-slate-900">{mode === "new" ? "Add New Transaction" : "Edit Transaction"}</h2>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Merchant Details</label>
                  <Input placeholder="Merchant Name" value={formData.merchant} onChange={(e: any) => setFormData({ ...formData, merchant: e.target.value })} className="mb-4" />

                  <label className="text-xs font-medium text-slate-500 mb-1 block">Description</label>
                  <Input className="mt-2" placeholder="Description (Optional)" value={formData.description} onChange={(e: any) => setFormData({ ...formData, description: e.target.value })} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1 block">Category</label>
                    <Input placeholder="Category" value={formData.category} onChange={(e: any) => setFormData({ ...formData, category: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1 block">Amount</label>
                    <Input type="number" placeholder="0.00" value={formData.amount} onChange={(e: any) => setFormData({ ...formData, amount: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1 block">Date</label>
                    <Input type="date" value={formData.date} onChange={(e: any) => setFormData({ ...formData, date: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1 block">Account ID</label>
                    <Input placeholder="Acct-1" value={formData.accountId} onChange={(e: any) => setFormData({ ...formData, accountId: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1 block">Type</label>
                    <NativeSelect value={formData.type} onChange={(val: any) => setFormData({ ...formData, type: val })} options={[{ value: "credit", label: "Credit (+)" }, { value: "debit", label: "Debit (-)" }]} placeholder="Select Type" />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1 block">Status</label>
                    <NativeSelect
                      value={formData.status}
                      onChange={(val: any) => setFormData({ ...formData, status: val })}
                      options={[
                        { value: "completed", label: "Completed" },
                        { value: "pending", label: "Pending" },
                        { value: "reversed", label: "Reversed" },
                      ]}
                      placeholder="Select Status"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                      <span>{mode === "new" ? "Adding..." : "Saving..."}</span>
                    </div>
                  ) : (
                    <span>{mode === "new" ? "Add Transaction" : "Save Changes"}</span>
                  )}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
