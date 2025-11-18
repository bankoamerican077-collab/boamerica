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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockAccounts } from "@/lib/data/MockData";
import { toast } from "sonner";
import { DollarSign, Upload } from "lucide-react";

export default function Deposit() {
	const [toAccount, setToAccount] = useState("");
	const [amount, setAmount] = useState("");
	const [routingNumber, setRoutingNumber] = useState("");
	const [accountNumber, setAccountNumber] = useState("");

	const handleExternalDeposit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!toAccount || !amount || !routingNumber || !accountNumber) {
			toast.error("Please fill in all required fields");
			return;
		}

		toast.success(
			"Deposit initiated successfully! Funds will be available in 1-2 business days."
		);
		setToAccount("");
		setAmount("");
		setRoutingNumber("");
		setAccountNumber("");
	};

	const handleCheckDeposit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!toAccount || !amount) {
			toast.error("Please fill in all required fields");
			return;
		}

		toast.success(
			"Check deposit submitted! Processing may take 1-2 business days."
		);
		setToAccount("");
		setAmount("");
	};

	return (
		<div className="max-w-3xl mx-auto space-y-6">
			<div className="flex justify-center items-center text-primary">
				<h1 className="text-3xl font-bold">Deposit</h1>
			</div>

			<Tabs
				defaultValue="external"
				className="space-y-6"
			>
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="external">From External Bank</TabsTrigger>
					<TabsTrigger value="check">Mobile Check Deposit</TabsTrigger>
				</TabsList>

				<TabsContent value="external">
					<Card className="p-6 border-0  bg-white">
						<form
							onSubmit={handleExternalDeposit}
							className="space-y-6"
						>
							<div className="space-y-4">
								<div className="space-y-2">
									<Label
										htmlFor="to-account"
										className="text-primary"
									>
										Deposit To
									</Label>
									<Select
										value={toAccount}
										onValueChange={setToAccount}
									>
										<SelectTrigger id="to-account">
											<SelectValue placeholder="Select account" />
										</SelectTrigger>
										<SelectContent>
											{mockAccounts
												.filter((acc) => acc.type !== "credit")
												.map((account) => (
													<SelectItem
														key={account.id}
														value={account.id}
													>
														{account.name} - {account.accountNumber}
													</SelectItem>
												))}
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label
										htmlFor="routing"
										className="text-primary"
									>
										Routing Number
									</Label>
									<Input
										id="routing"
										type="text"
										placeholder="9 digit routing number"
										value={routingNumber}
										onChange={(e) => setRoutingNumber(e.target.value)}
										maxLength={9}
										required
									/>
								</div>

								<div className="space-y-2">
									<Label
										htmlFor="account"
										className="text-primary"
									>
										Account Number
									</Label>
									<Input
										id="account"
										type="text"
										placeholder="External account number"
										value={accountNumber}
										onChange={(e) => setAccountNumber(e.target.value)}
										required
									/>
								</div>

								<div className="space-y-2">
									<Label
										htmlFor="ext-amount"
										className="text-primary"
									>
										Amount
									</Label>
									<div className="relative">
										<DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
										<Input
											id="ext-amount"
											type="number"
											step="0.01"
											placeholder="0.00"
											value={amount}
											onChange={(e) => setAmount(e.target.value)}
											className="pl-10"
											required
										/>
									</div>
								</div>
							</div>

							<Button
								type="submit"
								className="w-full"
							>
								Initiate Deposit
							</Button>
						</form>
					</Card>
				</TabsContent>

				<TabsContent value="check">
					<Card className="p-6 bg-white border-none">
						<form
							onSubmit={handleCheckDeposit}
							className="space-y-6"
						>
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="check-account">Deposit To</Label>
									<Select
										value={toAccount}
										onValueChange={setToAccount}
									>
										<SelectTrigger id="check-account">
											<SelectValue placeholder="Select account" />
										</SelectTrigger>
										<SelectContent>
											{mockAccounts
												.filter((acc) => acc.type !== "credit")
												.map((account) => (
													<SelectItem
														key={account.id}
														value={account.id}
													>
														{account.name} - {account.accountNumber}
													</SelectItem>
												))}
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="check-amount">Check Amount</Label>
									<div className="relative">
										<DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
										<Input
											id="check-amount"
											type="number"
											step="0.01"
											placeholder="0.00"
											value={amount}
											onChange={(e) => setAmount(e.target.value)}
											className="pl-10"
											required
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label>Check Images</Label>
									<div className="grid grid-cols-2 gap-4">
										<div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
											<Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
											<p className="text-sm text-muted-foreground">
												Front of Check
											</p>
										</div>
										<div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
											<Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
											<p className="text-sm text-muted-foreground">
												Back of Check
											</p>
										</div>
									</div>
									<p className="text-xs text-muted-foreground">
										Take clear photos of both sides of your endorsed check
									</p>
								</div>
							</div>

							<Button
								type="submit"
								className="w-full"
							>
								Submit Check Deposit
							</Button>
						</form>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
