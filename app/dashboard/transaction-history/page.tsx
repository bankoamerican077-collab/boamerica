'use client'

import { Plus, Edit2, Search, Filter, ArrowLeft, Calendar, CreditCard, Tag, FileText, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";


import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";



// --- MAIN APPLICATION CODE ---

const mockTransactions = [
  {
    id: "txn-5",
    accountId: "acc-2",
    date: "2025-11-02",
    merchant: "Transfer from Checking",
    description: "Monthly savings allocation for the holiday fund.",
    category: "Transfer",
    amount: 500.0,
    type: "credit",
    status: "completed",
  },
  {
    id: "txn-6",
    accountId: "acc-1",
    date: "2025-11-05",
    merchant: "Food Vendor",
    description: "", 
    category: "Food",
    amount: 45.0,
    type: "debit",
    status: "pending",
  },
  {
    id: "txn-7",
    accountId: "acc-1",
    date: "2025-11-06",
    merchant: "Tech Gadgets Inc",
    description: "New headphones for office noise cancellation.", 
    category: "Electronics",
    amount: 120.50,
    type: "debit",
    status: "completed",
  },
];

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState(mockTransactions);
  
  // Navigation State
  const [selectedTransaction, setSelectedTransaction] = useState(null); // If set, shows Detail View
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("new");

  const [searchTerm, setSearchTerm] = useState("");
	const [filterType, setFilterType] = useState("all");
	const [filterAccount, setFilterAccount] = useState("all");

	const [selectedDate, setSelectedDate] = useState("");

	// DATE FILTERING LOGIC (Daily/Weekly/Monthly removed)
	const applyDateFilter = (transactionDate) => {
		if (!selectedDate) return true;

		const date = new Date(transactionDate);
		const selected = new Date(selectedDate);

		return (
			date.getFullYear() === selected.getFullYear() &&
			date.getMonth() === selected.getMonth() &&
			date.getDate() === selected.getDate()
		);
	};

	// MAIN FILTER
	const filteredTransactions = mockTransactions.filter((t) => {
		const matchesSearch =
			t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
			t.category.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesType = filterType === "all" || t.type === filterType;

		const matchesDate = applyDateFilter(t.date);

		return matchesSearch && matchesType && matchesDate;
	});

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    accountId: "",
    date: "",
    merchant: "",
    description: "",
    category: "",
    amount: "",
    type: "credit",
    status: "completed",
  });

  const totalBalance = transactions.reduce((acc, tx) => {
    if (tx.type === "credit") return acc + Number(tx.amount);
    if (tx.type === "debit") return acc - Number(tx.amount);
    return acc;
  }, 0);

  // --- HANDLERS ---

  const handleRowClick = (tx) => {
    setSelectedTransaction(tx);
  };

  const openNewForm = (e) => {
    e.stopPropagation(); // Prevent row click if button inside row
    setMode("new");
    setFormData({
      id: "",
      accountId: "",
      date: new Date().toISOString().split('T')[0],
      merchant: "",
      description: "",
      category: "",
      amount: "",
      type: "credit",
      status: "completed",
    });
    setShowForm(true);
  };




  // --- DETAIL VIEW COMPONENT ---
  if (selectedTransaction && !showForm) {
    return (
      <div className="fixed inset-0 bg-slate-50 z-40 overflow-y-auto animate-in slide-in-from-bottom-4 duration-200">
        <div className="max-w-3xl mx-auto min-h-screen bg-white shadow-xl border-x border-slate-100">
          {/* Content */}
          <div className="p-6 space-y-8">
             {/* header nav */}

		  <div onClick={()=> setSelectedTransaction(null)}>
			<ArrowLeft/>
		  </div>
            {/* Amount Hero */}
            <div className="text-center py-8 border-b border-slate-100 border-dashed">
              <span className={`text-4xl font-bold tracking-tight ${
                selectedTransaction.type === 'debit' ? 'text-slate-900' : 'text-emerald-600'
              }`}>
                 {selectedTransaction.type === 'debit' ? '-' : '+'}${selectedTransaction.amount.toFixed(2)}
              </span>
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                  ${selectedTransaction.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 
                    selectedTransaction.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                    'bg-red-100 text-red-800'}`}>
                  {selectedTransaction.status === 'completed' ? <CheckCircle className="w-3 h-3 mr-1"/> : 
                   selectedTransaction.status === 'pending' ? <AlertCircle className="w-3 h-3 mr-1"/> :
                   <XCircle className="w-3 h-3 mr-1"/>}
                  {selectedTransaction.status}
                </span>
              </div>
            </div>

            {/* Main Details Grid */}
            <div className="grid gap-6 md:grid-cols-2">
               
               <div className="space-y-1">
                 <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                   <CreditCard className="w-3 h-3" /> Merchant
                 </label>
                 <p className="text-lg font-medium text-slate-900">{selectedTransaction.merchant}</p>
               </div>

               <div className="space-y-1">
                 <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                   <Calendar className="w-3 h-3" /> Date
                 </label>
                 <p className="text-lg font-medium text-slate-900">
                    {new Date(selectedTransaction.date).toLocaleDateString(undefined, { 
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                    })}
                 </p>
               </div>

               <div className="space-y-1">
                 <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                   <Tag className="w-3 h-3" /> Category
                 </label>
                 <p className="text-lg font-medium text-slate-900">{selectedTransaction.category}</p>
               </div>

               <div className="space-y-1">
                 <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                   <FileText className="w-3 h-3" /> Transaction ID
                 </label>
                 <p className="text-sm font-mono text-slate-600 bg-slate-100 inline-block px-2 py-1 rounded">
                   {selectedTransaction.id}
                 </p>
               </div>
            </div>

            {/* Description Section */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                Description / Notes
              </label>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                {selectedTransaction.description || "No description provided for this transaction."}
              </p>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD VIEW (DEFAULT) ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-6xl mx-auto space-y-6">
		 {/* PAGE HEADER */}
			<div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
				<div className="flex justify-start items-center text-primary">
					<h1 className="text-3xl font-bold">Transaction History</h1>
				</div>

				{/* ✅ FILTER ROW */}
				<div className="flex flex-row items-center justify-end gap-2">
					{/* ✅ Search Input */}
					<Input
						placeholder="Search transactions..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-40 h-8 text-xs"
					/>

					{/* ✅ Type Filter */}
					<Select
						value={filterType}
						onValueChange={setFilterType}
					>
						<SelectTrigger className="w-28 h-8 text-xs">
							<SelectValue placeholder="Type" />
						</SelectTrigger>
						<SelectContent className="bg-white">
							<SelectItem value="all">All</SelectItem>
							<SelectItem value="credit">Credit</SelectItem>
							<SelectItem value="debit">Debit</SelectItem>
						</SelectContent>
					</Select>

					{/* ✅ Date Filter */}
					<div className="flex flex-col">
						<input
							type="date"
							value={selectedDate}
							onChange={(e) => {
								setSelectedDate(e.target.value);
							}}
							className="border border-primary rounded-sm px-2 py-0.5 text-xs h-7 bg-white 
							focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
				</div>
			</div>

        {/* DESKTOP TABLE VIEW */}
        <Card className="hidden lg:block bg-white overflow-hidden shadow-sm rounded-md">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Date</th>
                  <th className="text-left p-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Merchant</th>
                  <th className="text-left p-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Category</th>
                  <th className="text-left p-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Status</th>
                  <th className="text-right p-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Amount</th>
                  <th className="text-right p-4 font-semibold text-slate-500 uppercase tracking-wider text-xs"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr 
                    key={tx.id} 
                    onClick={() => handleRowClick(tx)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <td className="p-4 whitespace-nowrap text-slate-600 font-medium">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      <div className="font-medium text-slate-900">{tx.merchant}</div>
                      {tx.description && (
                        <div className="text-xs text-slate-500 mt-0.5 line-clamp-1 max-w-[200px]">
                          {tx.description}
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 group-hover:bg-white transition-colors">
                        {tx.category}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${
                          tx.status === 'completed' ? 'bg-emerald-500' :
                          tx.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                        }`} />
                        <span className="capitalize text-slate-700">{tx.status}</span>
                      </div>
                    </td>

                    <td className={`p-4 text-right font-bold ${
                      tx.type === "debit" ? "text-slate-900" : "text-emerald-600"
                    }`}>
                      {tx.type === "debit" ? "-" : "+"}${tx.amount.toFixed(2)}
                    </td>

                    <td className="p-4 text-right text-slate-400">
                       <span className="group-hover:text-slate-600 text-xs">View Details &rarr;</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* MOBILE CARD VIEW */}
        <div className="lg:hidden space-y-3">
          {transactions.map((tx) => (
            <div 
              key={tx.id} 
              onClick={() => handleRowClick(tx)}
              className="bg-white p-4 rounded-md border shadow-sm active:scale-[0.99] transition-transform"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">
                    {new Date(tx.date).toLocaleDateString()}
                  </p>
                  <h3 className="font-semibold text-slate-900 text-base">{tx.merchant}</h3>
                  {tx.description && (
                    <p className="text-xs text-slate-500 mt-1 italic line-clamp-1">
                      "{tx.description}"
                    </p>
                  )}
                </div>
                <p className={`font-bold text-lg ${
                  tx.type === "debit" ? "text-slate-900" : "text-emerald-600"
                }`}>
                  {tx.type === "debit" ? "-" : "+"}{tx.amount.toFixed(2)}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-3">
                <div className="flex gap-2">
                   <span className="px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                    {tx.category}
                  </span>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                     tx.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                     tx.status === 'pending' ? 'bg-amber-50 text-amber-700' : 
                     'bg-red-50 text-red-700'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* NO RESULTS */}
        {transactions.length === 0 && (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center justify-center text-slate-500">
              <Filter className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium">No transactions found</p>
            </div>
          </Card>
        )}

        
      </div>
    </div>
  );
}