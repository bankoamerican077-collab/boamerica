"use client";

import { useState, useEffect } from "react";
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
import LoadingSpinner from "@/components/tools/loading-spinner";
import { Calendar } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function Transfer() {
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [memo, setMemo] = useState("");

  // Restriction trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setShowPopup(true); // show restriction
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  // Blocked submission
  const handleBlocked = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPopup(true);
  };

  const disabled = true; // entire form is restricted

  // Loading UI
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <LoadingSpinner size={64} />
      </div>
    );
  }

  return (
    <>
      {/* Restriction Popup */}
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">
              Transfers Restricted
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              Your account is currently restricted from making transfers.
              <br />
              Please visit a physical bank branch to restore your account
              status.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Page Layout */}
      <div className="max-w-3xl mx-auto space-y-6 opacity-40 pointer-events-none">
        <div className="flex justify-center items-center text-primary">
          <h1 className="text-3xl font-bold">Transfer</h1>
        </div>

        <Card className="p-6 border-0 bg-white">
          <form onSubmit={handleBlocked} className="space-y-6">
            <div className="space-y-4">
              {/* FROM ACCOUNT */}
              <div className="space-y-2">
                <Label className="text-primary">From Account</Label>

                <Select
                  value={fromAccount}
                  onValueChange={setFromAccount}
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>

                  <SelectContent>
                    {mockAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name} — {account.accountNumber} ($
                        {account.balance.toFixed(2)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* RECIPIENT */}
              <div className="space-y-2">
                <Label className="text-primary">Recipient Account</Label>
                <Input
                  type="text"
                  placeholder="Recipient account details"
                  value={toAccount}
                  onChange={(e) => setToAccount(e.target.value)}
                  disabled={disabled}
                />
              </div>
            </div>

            {/* AMOUNT + DATE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* AMOUNT */}
              <div className="space-y-2">
                <Label className="text-primary">Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={disabled}
                />
              </div>

              {/* SCHEDULE DATE — ONLY SHOW IF FROM ACCOUNT SELECTED */}
              {fromAccount && (
                <div className="space-y-2">
                  <Label className="text-primary">Schedule Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="pl-10"
                      min={new Date().toISOString().split("T")[0]}
                      disabled={disabled}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* MEMO */}
            <div className="space-y-2">
              <Label className="text-primary">Memo</Label>
              <Input
                type="text"
                placeholder="Add a note for this transfer"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                maxLength={100}
                disabled={disabled}
              />
            </div>

            {/* BUTTONS */}
            <Button type="submit" className="w-full" disabled={disabled}>
              Transfer
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}
