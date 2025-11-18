"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { mockUser } from "@/lib/data/MockData";
import { toast } from "sonner";

export default function UserSettingsPage() {
	const handleSave = () => toast.success("Settings saved successfully!");

	return (
		<div className="max-w-4xl mx-auto space-y-12 pb-20">
			{/* PAGE TITLE */}
			<div className="flex justify-center items-center text-primary">
				<h1 className="text-3xl font-bold">Settings</h1>
			</div>

			{/* ========================== */}
			{/* ✅ PROFILE & PERSONAL INFO */}
			{/* ========================== */}
			<section
				id="profile"
				className="space-y-4 scroll-mt-20"
			>
				<h2 className="text-2xl font-semibold text-primary">
					Profile & Personal Information
				</h2>
				<p className="text-sm text-muted-foreground mb-4">
					Update your contact info and personal details.
				</p>

				<Card className="p-6 space-y-6 bg-white border-0">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>First Name</Label>
							<Input defaultValue={mockUser.firstName} />
						</div>
						<div className="space-y-2">
							<Label>Last Name</Label>
							<Input defaultValue={mockUser.lastName} />
						</div>
					</div>

					<div className="space-y-2">
						<Label>Email Address</Label>
						<Input
							type="email"
							defaultValue={mockUser.email}
						/>
					</div>

					<div className="space-y-2">
						<Label>Phone Number</Label>
						<Input
							type="tel"
							defaultValue={mockUser.phone}
						/>
					</div>

					<Button onClick={handleSave}>Save Changes</Button>
				</Card>
			</section>

			{/* ========================== */}
			{/* ✅ SECURITY & LOGIN */}
			{/* ========================== */}
			<section
				id="security"
				className="space-y-4 scroll-mt-20"
			>
				<h2 className="text-2xl font-semibold text-primary">
					Security & Login
				</h2>
				<p className="text-sm text-muted-foreground mb-4">
					Manage your password, 2FA, and login activity.
				</p>

				{/* Password Update */}
				<Card className="p-6 space-y-4 bg-white border-0">
					<h3 className="text-lg font-semibold">Change Password</h3>
					<div className="space-y-4">
						<div className="space-y-2">
							<Label>Current Password</Label>
							<Input type="password" />
						</div>

						<div className="space-y-2">
							<Label>New Password</Label>
							<Input type="password" />
						</div>

						<div className="space-y-2">
							<Label>Confirm New Password</Label>
							<Input type="password" />
						</div>

						<Button onClick={handleSave}>Update Password</Button>
					</div>
				</Card>

				{/* Login Activity */}
				<Card className="p-6 space-y-4 bg-white border-0">
					<h3 className="text-lg font-semibold">Recent Login Activity</h3>

					<div className="space-y-3">
						{[
							{
								device: "Chrome on Windows",
								location: "New York, NY",
								time: "2 hours ago",
							},
							{
								device: "Safari on iPhone",
								location: "New York, NY",
								time: "1 day ago",
							},
						].map((login, i) => (
							<div
								key={i}
								className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
							>
								<div>
									<p className="font-medium">{login.device}</p>
									<p className="text-sm text-muted-foreground">
										{login.location}
									</p>
								</div>
								<p className="text-sm text-muted-foreground">{login.time}</p>
							</div>
						))}
					</div>
				</Card>
			</section>

			{/* ========================== */}
			{/* ✅ ALERTS & NOTIFICATIONS */}
			{/* ========================== */}
			<section
				id="notifications"
				className="space-y-4 scroll-mt-20"
			>
				<h2 className="text-2xl font-semibold text-primary">
					Alerts & Notifications
				</h2>
				<p className="text-sm text-muted-foreground mb-4">
					Control how we notify you about your account.
				</p>

				<Card className="p-6 space-y-6 bg-white border-0">
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Email Alerts</h3>
						{[
							{
								label: "Account Balance Alerts",
								description: "Get notified when your balance is low",
							},
							{
								label: "High-Value Transactions",
								description: "Alerts for transactions above your threshold",
							},
							{
								label: "Deposit Updates",
								description: "Get notified when deposits process",
							},
							{
								label: "Monthly Statements",
								description: "Receive your statement by email",
							},
						].map((item, i) => (
							<div
								key={i}
								className="flex items-center justify-between"
							>
								<div>
									<p className="font-medium">{item.label}</p>
									<p className="text-sm text-muted-foreground">
										{item.description}
									</p>
								</div>
								<Switch defaultChecked />
							</div>
						))}
					</div>

					<div className="space-y-4 border-t pt-6 ">
						<h3 className="text-lg font-semibold">SMS Alerts</h3>
						{[
							{
								label: "Security Alerts",
								description: "Receive high-risk activity notifications",
							},
							{
								label: "Transaction Alerts",
								description: "Instant messages for all transactions",
							},
						].map((item, i) => (
							<div
								key={i}
								className="flex items-center justify-between"
							>
								<div>
									<p className="font-medium">{item.label}</p>
									<p className="text-sm text-muted-foreground">
										{item.description}
									</p>
								</div>
								<Switch />
							</div>
						))}
					</div>

					<Button onClick={handleSave}>Save Preferences</Button>
				</Card>
			</section>

			{/* ========================== */}
			{/* ✅ DOCUMENTS & PAPERLESS */}
			{/* ========================== */}
			<section
				id="documents"
				className="space-y-4 scroll-mt-20"
			>
				<h2 className="text-2xl font-semibold text-primary">
					Statements & Documents
				</h2>
				<p className="text-sm text-muted-foreground mb-4">
					Download statements and manage paperless delivery.
				</p>

				{/* Paperless */}
				<Card className="p-6 space-y-4 bg-white border-0">
					<h3 className="text-lg font-semibold">Paperless Delivery</h3>
					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium">Go Paperless</p>
							<p className="text-sm text-muted-foreground">
								Receive digital statements by email
							</p>
						</div>
						<Switch defaultChecked />
					</div>
				</Card>

				{/* Statement History */}
				<Card className="p-6 space-y-4 bg-white border-0">
					<h3 className="text-lg font-semibold">Statement History</h3>

					<div className="space-y-3">
						{[
							{ period: "October 2025", date: "11/01/2025" },
							{ period: "September 2025", date: "10/01/2025" },
							{ period: "August 2025", date: "09/01/2025" },
						].map((statement, i) => (
							<div
								key={i}
								className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
							>
								<div>
									<p className="font-medium">{statement.period}</p>
									<p className="text-sm text-muted-foreground">
										Statement Date: {statement.date}
									</p>
								</div>
								<Button
									variant="outline"
									size="sm"
								>
									Download PDF
								</Button>
							</div>
						))}
					</div>
				</Card>
			</section>
		</div>
	);
}
