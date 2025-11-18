"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectTrigger,
	SelectItem,
	SelectContent,
	SelectValue,
} from "@/components/ui/select";

// ✅ Mock Data in your EXACT format
const mockTransactions = [
	{
		id: "txn-5",
		accountId: "acc-2",
		date: "2025-11-02",
		merchant: "Transfer from Checking",
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
		category: "Food",
		amount: 45.0,
		type: "debit",
		status: "pending",
	},
];

export default function AdminTransactionsDashboard() {
	const [transactions, setTransactions] = useState(mockTransactions);
	const [showForm, setShowForm] = useState(false);

	const [mode, setMode] = useState<"new" | "edit">("new");

	// ✅ Form structure (your pattern)
	const [formData, setFormData] = useState({
		id: "",
		accountId: "",
		date: "",
		merchant: "",
		category: "",
		amount: "",
		type: "credit",
		status: "completed",
	});

	// ✅ Balance calc
	const totalBalance = transactions.reduce((acc, tx) => {
		if (tx.type === "credit") return acc + Number(tx.amount);
		if (tx.type === "debit") return acc - Number(tx.amount);
		return acc;
	}, 0);

	// ✅ Open new form
	const openNewForm = () => {
		setMode("new");
		setFormData({
			id: "",
			accountId: "",
			date: "",
			merchant: "",
			category: "",
			amount: "",
			type: "credit",
			status: "completed",
		});
		setShowForm(true);
	};

	// ✅ Edit existing
	const openEditForm = (tx: any) => {
		setMode("edit");
		setFormData({
			...tx,
			amount: String(tx.amount),
		});
		setShowForm(true);
	};

	// ✅ Handle save
	const handleSave = () => {
		if (!formData.amount || Number(formData.amount) <= 0) {
			alert("Enter a valid amount.");
			return;
		}
		if (!formData.date || !formData.merchant || !formData.category) {
			alert("Fill all required fields.");
			return;
		}

		const normalized = {
			id: formData.id || `txn-${Date.now()}`,
			accountId: formData.accountId || "acc-1",
			date: formData.date,
			merchant: formData.merchant,
			category: formData.category,
			amount: Number(formData.amount),
			type: formData.type,
			status: formData.status,
		};

		if (mode === "new") {
			setTransactions((prev) => [...prev, normalized]);
		} else {
			setTransactions((prev) =>
				prev.map((t) => (t.id === normalized.id ? normalized : t))
			);
		}

		setShowForm(false);
	};

	return (
		<div className="space-y-6">
			{/* ✅ Header + Balance */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold">Admin Transaction History</h1>
					<p className="text-lg font-semibold text-primary mt-1">
						Total Balance: ${totalBalance.toFixed(2)}
					</p>
				</div>

				<Button onClick={openNewForm}>+ Add New Transaction</Button>
			</div>

			{/* ✅ DESKTOP TABLE VIEW */}
			<Card className="hidden lg:block bg-white rounded-md overflow-hidden">
				<table className="w-full">
					<thead className="bg-muted/40 border-b">
						<tr>
							<th className="text-left p-4">Date</th>
							<th className="text-left p-4">Merchant</th>
							<th className="text-left p-4">Category</th>
							<th className="text-left p-4">Status</th>
							<th className="text-right p-4">Amount</th>
							<th className="text-right p-4"></th>
						</tr>
					</thead>

					<tbody>
						{transactions.map((tx) => (
							<tr
								key={tx.id}
								className="border-b hover:bg-muted/40"
							>
								<td className="p-4">
									{new Date(tx.date).toLocaleDateString()}
								</td>

								<td className="p-4 font-medium">{tx.merchant}</td>

								<td className="p-4">{tx.category}</td>

								<td className="p-4 capitalize">{tx.status}</td>

								<td
									className={`p-4 text-right font-semibold ${
										tx.type === "debit" ? "text-destructive" : "text-green-600"
									}`}
								>
									{tx.type === "debit" ? "-" : "+"}${tx.amount.toFixed(2)}
								</td>

								<td className="p-4 text-right">
									<Button
										size="sm"
										variant="outline"
										onClick={() => openEditForm(tx)}
									>
										Edit
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</Card>

			{/* ✅ MOBILE CARD VIEW */}
			<div className="lg:hidden space-y-3">
				{transactions.map((tx) => (
					<Card
						key={tx.id}
						className="p-4 bg-white rounded-md space-y-3"
					>
						<div className="flex justify-between">
							<p className="text-sm text-gray-500">
								{new Date(tx.date).toLocaleDateString()}
							</p>

							<p
								className={`font-semibold ${
									tx.type === "debit" ? "text-red-600" : "text-green-600"
								}`}
							>
								{tx.type === "debit" ? "-" : "+"}${tx.amount.toFixed(2)}
							</p>
						</div>

						<div>
							<p className="font-medium">{tx.merchant}</p>
							<p className="text-xs text-gray-500">{tx.category}</p>
						</div>

						<p className="text-xs capitalize text-gray-500">{tx.status}</p>

						<Button
							size="sm"
							className="w-full mt-2"
							variant="outline"
							onClick={() => openEditForm(tx)}
						>
							Edit
						</Button>
					</Card>
				))}
			</div>

			{/* ✅ NO RESULTS */}
			{transactions.length === 0 && (
				<Card className="p-12 text-center">
					<p className="text-muted-foreground">No transactions found</p>
				</Card>
			)}

			{/* ✅ FORM MODAL */}
			{showForm && (
				<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
					<Card className="w-full max-w-md p-6 space-y-4 bg-white">
						<h2 className="text-xl font-semibold">
							{mode === "new" ? "Add New Transaction" : "Edit Transaction"}
						</h2>

						<Input
							placeholder="Merchant"
							value={formData.merchant}
							onChange={(e) =>
								setFormData({ ...formData, merchant: e.target.value })
							}
						/>

						<Input
							placeholder="Category"
							value={formData.category}
							onChange={(e) =>
								setFormData({ ...formData, category: e.target.value })
							}
						/>

						<Input
							type="number"
							placeholder="Amount"
							value={formData.amount}
							onChange={(e) =>
								setFormData({ ...formData, amount: e.target.value })
							}
						/>

						<Input
							type="date"
							value={formData.date}
							onChange={(e) =>
								setFormData({ ...formData, date: e.target.value })
							}
						/>

						{/* TYPE */}
						<Select
							value={formData.type}
							onValueChange={(val) => setFormData({ ...formData, type: val })}
						>
							<SelectTrigger>
								<SelectValue placeholder="Type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="credit">Credit</SelectItem>
								<SelectItem value="debit">Debit</SelectItem>
							</SelectContent>
						</Select>

						{/* STATUS */}
						<Select
							value={formData.status}
							onValueChange={(val) => setFormData({ ...formData, status: val })}
						>
							<SelectTrigger>
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="completed">Completed</SelectItem>
								<SelectItem value="pending">Pending</SelectItem>
								<SelectItem value="reversed">Reversed</SelectItem>
							</SelectContent>
						</Select>

						{/* ACTIONS */}
						<div className="flex justify-end gap-3">
							<Button
								variant="outline"
								onClick={() => setShowForm(false)}
							>
								Cancel
							</Button>

							<Button onClick={handleSave}>
								{mode === "new" ? "Add" : "Save Changes"}
							</Button>
						</div>
					</Card>
				</div>
			)}
		</div>
	);
}
