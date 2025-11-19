"use client";

import {
  Home,
  ArrowUpDown,
  DollarSign,
  History,
  Settings,
  Menu,
  X,
  LayoutDashboard,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../auth/auth-provider";
import { getUserByIdentifier } from "@/lib/firebaseUtils";

const navItems = [
  { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { title: "Transfer", path: "/dashboard/transfer", icon: ArrowUpDown },
  { title: "Deposit", path: "/dashboard/deposit", icon: DollarSign },
  {
    title: "Transaction History",
    path: "/dashboard/transaction-history",
    icon: History,
  },
  { title: "Settings", path: "/dashboard/user-settings", icon: Settings },
  { title: "Admin", path: "/admin", icon: Lock },
];

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
  role: "user" | "admin";
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [user, setUser] = useState<UserSettings | null>(null);
  const { user: authUser } = useAuth();
  useEffect(() => {
    if (!authUser) return;
    const fetchUser = async () => {
      const email = authUser.email; // replace with logged-in user
      const data = await getUserByIdentifier("email", email);
      if (data) setUser(data as UserSettings);
    };
    fetchUser();
  }, [authUser]);

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white  text-gray-700">
      <div className="flex items-center justify-between p-3 lg:p-4.5">
        <div className="flex gap-1 items-start">
          <h2 className="text-xl font-bold text-primary whitespace-nowrap">
            BANK OF AMERICA
          </h2>
          <img
            src="/images/svg/bank-of-america-logo-png-symbol-0.png"
            alt="bank of america"
            className="w-10 h-5"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <nav className="relative flex-1 flex flex-row">
        <div className="bg-gray-100/60 w-14"></div>
        <div className="fixed">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-6 px-4 py-4 text font-bold  transition-colors",
                pathname === item.path
                  ? "text-blue-900 underline underline-offset-4 decoration-blue-900 bg-sidebar-accent/50"
                  : " hover:underline",
                user?.role !== "admin" && "last:hidden"
              )}
            >
              <item.icon className="h-5 w-5 text-blue-900" />
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      </nav>

      <div className="p-4">
        <p className="text-xs text-muted-foreground">
          © 2025 BANK OF AMERICA. Member FDIC.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 right-2 z-50"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Drawer */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/80 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <aside className="fixed left-0 top-0 h-full w-72 z-50 lg:hidden">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 fixed left-0 top-0 h-full z-30">
        <SidebarContent />
      </aside>
    </>
  );
}
