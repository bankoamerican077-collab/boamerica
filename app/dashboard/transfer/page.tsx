"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { mockAccounts } from "@/lib/data/MockData";
import { toast } from "sonner";
import { ArrowRight, Calendar } from "lucide-react";

export default function Transfer() {
	const [fromAccount, setFromAccount] = useState("");
	const [toAccount, setToAccount] = useState("");
	const [amount, setAmount] = useState("");
	const [date, setDate] = useState("");
	const [memo, setMemo] = useState("");

	const handleTransfer = (e: React.FormEvent) => {
		e.preventDefault();

		if (!fromAccount || !toAccount || !amount) {
			toast.error("Please fill in all required fields");
			return;
		}

		if (fromAccount === toAccount) {
			toast.error("Cannot transfer to the same account");
			return;
		}

		toast.success("Transfer scheduled successfully!");
		setFromAccount("");
		setToAccount("");
		setAmount("");
		setDate("");
		setMemo("");
	};

	return (
		<div className="max-w-3xl mx-auto space-y-6">
			<div className="flex justify-center items-center text-primary">
				<h1 className="text-3xl font-bold">Transfer</h1>
			</div>

			<Card className="p-6 border-0 bg-white">
				<form
					onSubmit={handleTransfer}
					className="space-y-6"
				>
					<div className="space-y-4">
						<div className="space-y-2">
							<Label
								htmlFor="from"
								className="text-primary"
							>
								From Account
							</Label>
							<Select
								value={fromAccount}
								onValueChange={setFromAccount}
							>
								<SelectTrigger id="from">
									<SelectValue placeholder="Select account" />
								</SelectTrigger>
								<SelectContent>
									{mockAccounts.map((account) => (
										<SelectItem
											key={account.id}
											value={account.id}
										>
											{account.name} - {account.accountNumber} ($
											{account.balance.toFixed(2)})
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label
								htmlFor="to"
								className="text-primary"
							>
								Recipient Account
							</Label>
							<Input
								id="to"
								type="text"
								placeholder="Recipient account details"
								value={toAccount}
								onChange={(e) => setToAccount(e.target.value)}
								required
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label
								htmlFor="amount"
								className="text-primary"
							>
								Amount
							</Label>
							<Input
								id="amount"
								type="number"
								step="0.01"
								placeholder="0.00"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label
								htmlFor="date"
								className="text-primary"
							>
								Schedule Date
							</Label>
							<div className="relative">
								<Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
								<Input
									id="date"
									type="date"
									value={date}
									onChange={(e) => setDate(e.target.value)}
									className="pl-10"
									min={new Date().toISOString().split("T")[0]}
								/>
							</div>
						</div>
					</div>

					<div className="space-y-2">
						<Label
							htmlFor="memo"
							className="text-primary"
						>
							Memo{" "}
						</Label>
						<Input
							id="memo"
							type="text"
							placeholder="Add a note for this transfer"
							value={memo}
							onChange={(e) => setMemo(e.target.value)}
							maxLength={100}
						/>
					</div>

					<div className="flex gap-3">
						<Button
							type="submit"
							className="flex-1"
						>
							{date ? "Schedule Transfer" : "Transfer Now"}
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								setFromAccount("");
								setToAccount("");
								setAmount("");
								setDate("");
								setMemo("");
							}}
						>
							Clear
						</Button>
					</div>
				</form>
			</Card>
		</div>
	);
}
