"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { getUserByEmail } from "@/lib/firebaseUtils"; // adjust path if needed
import LoadingSpinner from "@/components/tools/loading-spinner";

interface UserSettings {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  accountBalanceAlerts: boolean;
  depositUpdate: boolean;
  highValueTransactions: boolean;
  securityAlerts: boolean;
  transactionAlerts: boolean;
  paperlessDelivery: boolean;
}

export default function UserSettingsPage() {
  const [user, setUser] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const email = "daniel.smith@email.com"; // replace with current logged-in user's email
      const data = await getUserByEmail(email);
      if (data) {
        setUser(data as UserSettings);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleSave = () => toast.success("Settings saved successfully!");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <LoadingSpinner size={64} />
      </div>
    );
  }
  if (!user) return <p className="text-center mt-10">User not found.</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* PAGE TITLE */}
      <div className="flex justify-center items-center text-primary">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      {/* PROFILE & PERSONAL INFO */}
      <section id="profile" className="space-y-4 scroll-mt-20">
        <h2 className="text-2xl font-semibold text-primary">
          Profile & Personal Information
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Update your contact info and personal details.
        </p>

        <Card className="p-6 space-y-6 bg-white border-0 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input defaultValue={user.firstName} />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input defaultValue={user.lastName} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input type="email" defaultValue={user.email} />
          </div>

          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input type="tel" defaultValue={user.phoneNumber} />
          </div>
        </Card>
      </section>

      {/* ALERTS & NOTIFICATIONS */}
      <section id="notifications" className="space-y-4 scroll-mt-20">
        <h2 className="text-2xl font-semibold text-primary">
          Alerts & Notifications
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Control how we notify you about your account.
        </p>

        <Card className="p-6 space-y-6 bg-white border-0 rounded-md">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Email Alerts</h3>
            {[
              {
                label: "Account Balance Alerts",
                checked: user.accountBalanceAlerts,
                description: "Get notified when your balance is low",
              },
              {
                label: "High-Value Transactions",
                checked: user.highValueTransactions,
                description: "Alerts for transactions above your threshold",
              },
              {
                label: "Deposit Updates",
                checked: user.depositUpdate,
                description: "Get notified when deposits process",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <Switch defaultChecked={item.checked} />
              </div>
            ))}
          </div>

          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">SMS Alerts</h3>
            {[
              {
                label: "Security Alerts",
                checked: user.securityAlerts,
                description: "Receive high-risk activity notifications",
              },
              {
                label: "Transaction Alerts",
                checked: user.transactionAlerts,
                description: "Instant messages for all transactions",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <Switch defaultChecked={item.checked} />
              </div>
            ))}
          </div>

          <Button onClick={handleSave}>Save Preferences</Button>
        </Card>
      </section>

      {/* DOCUMENTS & PAPERLESS */}
      <section id="documents" className="space-y-4 scroll-mt-20">
        <h2 className="text-2xl font-semibold text-primary">
          Statements & Documents
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Download statements and manage paperless delivery.
        </p>

        <Card className="p-6 space-y-4 bg-white border-0 rounded-md">
          <h3 className="text-lg font-semibold">Paperless Delivery</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Go Paperless</p>
              <p className="text-sm text-muted-foreground">
                Receive digital statements by email
              </p>
            </div>
            <Switch defaultChecked={user.paperlessDelivery} />
          </div>
        </Card>

        <Card className="p-6 space-y-4 bg-white border-0 rounded-md">
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
                <Button variant="outline" size="sm">
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
