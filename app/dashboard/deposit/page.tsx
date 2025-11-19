"use client";

import { useEffect, useState } from "react";
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
import { DollarSign } from "lucide-react";
import LoadingSpinner from "@/components/tools/loading-spinner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function Deposit() {
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setShowPopup(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleBlocked = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPopup(true);
  };

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
              Deposit Restricted
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              Your account is currently restricted from making deposits.
              <br />
              Please visit a physical bank branch to re-evaluate and restore
              your account status.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Page Layout (No Tabs) */}
      <div className="max-w-3xl mx-auto space-y-6 opacity-40 pointer-events-none">
        <div className="flex justify-center items-center text-primary">
          <h1 className="text-3xl font-bold">Deposit</h1>
        </div>

        <Card className="p-6 border-0 bg-white">
          <form onSubmit={handleBlocked} className="space-y-6">
            <div className="space-y-4">
              {/* Deposit To */}
              <div className="space-y-2">
                <Label className="text-primary">Deposit To</Label>
                <Select value={toAccount} onValueChange={setToAccount} disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAccounts
                      .filter((acc) => acc.type !== "credit")
                      .map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name} - {account.accountNumber}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label className="text-primary">Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10"
                    disabled
                  />
                </div>
              </div>
              {/* comments */}
              <div className="space-y-2">
                <Label className="text-primary">discription</Label>
                <div className="relative">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="write a short discription here"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10"
                    disabled
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled>
              Initiate Deposit
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}
