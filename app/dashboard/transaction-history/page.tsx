"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { mockTransactions, mockAccounts } from "@/lib/data/MockData";

export default function TransactionsPage() {
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

	return (
		<div className="space-y-6">
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

			{/* ✅ DESKTOP TABLE VIEW */}
			<Card className="hidden lg:block bg-white rounded-md overflow-hidden">
				<table className="w-full">
					<thead className="bg-muted/40 border-b">
						<tr>
							<th className="text-left p-4 font-semibold">Posting Date</th>
							<th className="text-left p-4 font-semibold">Description</th>
							<th className="text-left p-4 font-semibold">Status</th>
							<th className="text-right p-4 font-semibold">Amount</th>
						</tr>
					</thead>
					<tbody>
						{filteredTransactions.map((transaction) => {
							const account = mockAccounts.find(
								(acc) => acc.id === transaction.accountId
							);

							return (
								<tr
									key={transaction.id}
									className="border-b hover:bg-muted/40 transition"
								>
									<td className="p-4">
										{new Date(transaction.date).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
										})}
									</td>

									<td className="p-4">
										<div className="font-medium">{transaction.merchant}</div>
										<div className="text-xs text-muted-foreground">
											{account?.accountNumber}
										</div>
									</td>

									<td className="p-4 capitalize text-muted-foreground">
										{transaction.status}
									</td>

									<td
										className={`p-4 text-right font-semibold ${
											transaction.type === "debit"
												? "text-destructive"
												: "text-success"
										}`}
									>
										{transaction.type === "debit" ? "-" : "+"}$
										{Math.abs(transaction.amount).toFixed(2)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</Card>

			{/* ✅ MOBILE CARDS */}
			<div className="lg:hidden space-y-3">
				{filteredTransactions.map((transaction) => {
					const account = mockAccounts.find(
						(acc) => acc.id === transaction.accountId
					);

					return (
						<Card
							key={transaction.id}
							className="p-4 flex flex-col gap-3 bg-white rounded-md"
						>
							<div className="flex items-center justify-between">
								<p className="text-sm text-muted-foreground">
									{new Date(transaction.date).toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
										year: "numeric",
									})}
								</p>

								<p
									className={`font-semibold text-lg ${
										transaction.type === "debit"
											? "text-destructive"
											: "text-success"
									}`}
								>
									{transaction.type === "debit" ? "-" : "+"}$
									{Math.abs(transaction.amount).toFixed(2)}
								</p>
							</div>

							<div>
								<p className="font-medium">{transaction.merchant}</p>
								<p className="text-xs text-muted-foreground">
									{account?.accountNumber}
								</p>
							</div>

							<p className="text-xs capitalize text-muted-foreground">
								{transaction.status}
							</p>
						</Card>
					);
				})}
			</div>

			{/* ✅ NO RESULTS */}
			{filteredTransactions.length === 0 && (
				<Card className="p-12 text-center">
					<p className="text-muted-foreground">
						No transactions found matching your criteria
					</p>
				</Card>
			)}
		</div>
	);
}
