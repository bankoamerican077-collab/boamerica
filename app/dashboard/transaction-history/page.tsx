'use client';

import { useEffect, useState, useMemo } from "react";
import { 
  Plus, Edit2, Search, Filter, ArrowLeft, Calendar, CreditCard, Tag, 
  FileText, CheckCircle, AlertCircle, XCircle 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getAllTransactionHistory,TransactionType } from "@/lib/firebaseUtils";

// --------------------------------------------------
// Main Component
// --------------------------------------------------

export default function TransactionHistory() {

  // ------------------------------
  // STATES
  // ------------------------------
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedTransaction, setSelectedTransaction] = useState<TransactionType | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");

  // ------------------------------
  // LOAD FIRESTORE DATA
  // ------------------------------
  useEffect(() => {
    const load = async () => {
      const data = await getAllTransactionHistory();
      console.log('this is the data',data);
      
      setTransactions(data);
      setLoading(false);
    };
    load();
  }, []);

  // ------------------------------
  // FILTER LOGIC
  // ------------------------------
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === "all" || t.type === filterType;

      // Date filter
      const matchesDate = (() => {
        if (!selectedDate) return true;
        const date = new Date(t.date);
        const sel = new Date(selectedDate);
        return (
          date.getFullYear() === sel.getFullYear() &&
          date.getMonth() === sel.getMonth() &&
          date.getDate() === sel.getDate()
        );
      })();

      return matchesSearch && matchesType && matchesDate;
    });
  }, [transactions, searchTerm, filterType, selectedDate]);

  // ------------------------------
  // DETAIL VIEW RETURN
  // ------------------------------
  if (selectedTransaction) {
    return (
      <div className="fixed inset-0 bg-slate-50 z-40 overflow-y-auto animate-in slide-in-from-bottom-4 duration-200">
        <div className="max-w-3xl mx-auto min-h-screen bg-white shadow-xl border-x border-slate-100">

          <div className="p-6 space-y-8">

            {/* Back Button */}
            <div onClick={() => setSelectedTransaction(null)} className="cursor-pointer">
              <ArrowLeft />
            </div>

            {/* Amount Section */}
            <div className="text-center py-8 border-b border-slate-100 border-dashed">
              <span
                className={`text-4xl font-bold tracking-tight ${
                  selectedTransaction.type === "debit"
                    ? "text-slate-900"
                    : "text-emerald-600"
                }`}
              >
                {selectedTransaction.type === "debit" ? "-" : "+"}$
                {Number(selectedTransaction.amount).toFixed(2)}
              </span>

              {/* Status */}
              <div className="mt-2 flex items-center justify-center gap-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${
                      selectedTransaction.status === "completed"
                        ? "bg-emerald-100 text-emerald-800"
                        : selectedTransaction.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}
                >
                  {selectedTransaction.status === "completed" ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : selectedTransaction.status === "pending" ? (
                    <AlertCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <XCircle className="w-3 h-3 mr-1" />
                  )}
                  {selectedTransaction.status}
                </span>
              </div>
            </div>

            {/* MAIN DETAILS */}
            <div className="grid gap-6 md:grid-cols-2">
              
              <DetailItem
                icon={<CreditCard className="w-3 h-3" />}
                label="Merchant"
                value={selectedTransaction.merchant}
              />

              <DetailItem
                icon={<Calendar className="w-3 h-3" />}
                label="Date"
                value={new Date(selectedTransaction.date).toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />

              <DetailItem
                icon={<Tag className="w-3 h-3" />}
                label="Category"
                value={selectedTransaction.category}
              />

              <DetailItem
                icon={<FileText className="w-3 h-3" />}
                label="Transaction ID"
                value={
                  <span className="text-sm font-mono bg-slate-100 px-2 py-1 rounded inline-block">
                    {selectedTransaction.transactionId}
                  </span>
                }
              />
            </div>

            {/* Description */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                Description / Notes
              </label>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                {selectedTransaction.description || "No description provided."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------
  // MAIN DASHBOARD SECTION
  // ------------------------------
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-primary">Transaction History</h1>

          {/* FILTERS */}
          <div className="flex flex-row items-center justify-end gap-2">

            {/* Search */}
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-40 h-8 text-xs"
            />

            {/* Type */}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-28 h-8 text-xs">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="debit">Debit</SelectItem>
              </SelectContent>
            </Select>

            {/* Date */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-primary rounded-sm px-2 py-0.5 text-xs h-7 bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <Card className="p-12 text-center text-slate-500">Loading transactions...</Card>
        )}

        {/* DESKTOP TABLE */}
        {!loading && filteredTransactions.length > 0 && (
          <Card className="hidden lg:block bg-white overflow-hidden shadow-sm rounded-md">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <Th>Date</Th>
                    <Th>Merchant</Th>
                    <Th>Category</Th>
                    <Th>Status</Th>
                    <Th align="right">Amount</Th>
                    
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.map((tx) => (
                    <tr
                      key={tx.refId}
                      className="hover:bg-slate-50 cursor-pointer group"
                      onClick={() => setSelectedTransaction(tx)}
                    >
                      <Td>{new Date(tx.date).toLocaleDateString()}</Td>

                      <Td>
                        <div className="font-medium">{tx.merchant}</div>
                        {tx.description && (
                          <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                            {tx.description}
                          </div>
                        )}
                      </Td>

                      <Td>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-xs text-slate-700">
                          {tx.category}
                        </span>
                      </Td>

                      <Td>
                        <StatusDot status={tx.status} />
                      </Td>

                      <Td
                        align="right"
                        className={`font-bold ${
                          tx.type === "debit" ? "text-slate-900" : "text-emerald-600"
                        }`}
                      >
                        {tx.type === "debit" ? "-" : "+"}${tx.amount.toFixed(2)}
                      </Td>

                      <Td align="right">
                        <span className="group-hover:text-slate-600 text-xs text-slate-400">
                          View Details →
                        </span>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* MOBILE CARDS */}
        {!loading && filteredTransactions.length > 0 && (
          <div className="lg:hidden space-y-3">
            {filteredTransactions.map((tx) => (
              <MobileCard key={tx.refId} tx={tx} onClick={() => setSelectedTransaction(tx)} />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filteredTransactions.length === 0 && (
          <Card className="p-12 text-center">
            <Filter className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p className="text-lg text-slate-500">No transactions found</p>
          </Card>
        )}
      </div>
    </div>
  );
}

// --------------------------------------------------
// REUSABLE COMPONENTS
// --------------------------------------------------

function DetailItem({ icon, label, value }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
        {icon} {label}
      </label>
      <p className="text-lg font-medium text-slate-900">{value}</p>
    </div>
  );
}

function Th({ children, align = "left" }) {
  return (
    <th
      className={`p-4 font-semibold text-slate-500 uppercase text-xs tracking-wider text-${align}`}
    >
      {children}
    </th>
  );
}

function Td({ children, align = "left", className = "" }) {
  return (
    <td className={`p-4 text-${align} ${className}`}>{children}</td>
  );
}

function StatusDot({ status }) {
  const colors = {
    completed: "bg-emerald-500",
    pending: "bg-amber-500",
    failed: "bg-red-500",
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${colors[status]}`} />
      <span className="capitalize">{status}</span>
    </div>
  );
}

function MobileCard({ tx, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-4 rounded-md border shadow-sm active:scale-[0.99] transition-transform"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-slate-500 mb-1">
            {new Date(tx.date).toLocaleDateString()}
          </p>
          <h3 className="font-semibold">{tx.merchant}</h3>
          {tx.description && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-1 italic">
              "{tx.description}"
            </p>
          )}
        </div>

        <p
          className={`font-bold text-lg ${
            tx.type === "debit" ? "text-slate-900" : "text-emerald-600"
          }`}
        >
          {tx.type === "debit" ? "-" : "+"}${tx.amount.toFixed(2)}
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t mt-3">
        <span className="px-2 py-1 rounded-md text-xs bg-slate-100 text-slate-600">
          {tx.category}
        </span>
        <span
          className={`px-2 py-1 rounded-md text-xs ${
            tx.status === "completed"
              ? "bg-emerald-50 text-emerald-700"
              : tx.status === "pending"
              ? "bg-amber-50 text-amber-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {tx.status}
        </span>
      </div>
    </div>
  );
}
