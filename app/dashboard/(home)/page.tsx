"use client";

import { useEffect, useMemo, useState } from "react";
import HorizontalTop4BarChart from "@/components/charts/horizontal-top-bar";
import LineAreaGraph from "@/components/charts/line-area-graph";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Info } from "lucide-react";

import { getAllTransactionHistory } from "@/lib/firebaseUtils";
import type { TransactionType } from "@/lib/firebaseUtils";

// Spinner Component
function Spinner({ size = 36 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center">
      <svg
        style={{ width: size, height: size }}
        className="animate-spin"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
    </div>
  );
}

// Helpers for date parsing & grouping
const parseToDate = (
  tx: TransactionType & { createdAt?: any }
): Date | null => {
  try {
    if (tx.date) {
      const d = new Date(tx.date);
      if (!isNaN(d.getTime())) return d;
    }
    if (tx.createdAt) {
      // Firestore Timestamp
      // @ts-ignore
      if (typeof tx.createdAt.toDate === "function")
        return tx.createdAt.toDate();
      const d2 = new Date(tx.createdAt);
      if (!isNaN(d2.getTime())) return d2;
    }
  } catch {}
  return null;
};

const startOfWeek = (d: Date) => {
  const dt = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = dt.getUTCDay(); // 0 Sun ... 6 Sat
  const diff = (day + 6) % 7; // days since Monday
  dt.setUTCDate(dt.getUTCDate() - diff);
  dt.setUTCHours(0, 0, 0, 0);
  return dt;
};

const formatYYYYMMDD = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const formatYYYYMM = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

export default function HomeDashboard() {
  const [docs, setDocs] = useState<TransactionType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">(
    "weekly"
  );
  const [showDollar, setShowDollar] = useState<boolean>(true); // global $/% toggle

  // Fetch transactions
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getAllTransactionHistory();
        if (!mounted) return;
        const normalized = Array.isArray(data)
          ? data.map((tx) => ({
              ...tx,
              amount:
                typeof tx.amount === "number"
                  ? tx.amount
                  : Number(tx.amount || 0),
              type: tx.type || "credit",
            }))
          : [];
        setDocs(normalized);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setDocs([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Compute chart data and bank info
  const {
    transactionsForChart,
    weeklyData,
    monthlyData,
    dailyData,
    bankInfo,
    totalBalance,
  } = useMemo(() => {
    const merchantMap = new Map<string, number>();
    const weekMap = new Map<string, number>();
    const monthMap = new Map<string, number>();
    const dayMap = new Map<string, number>();

    let totalIn = 0,
      totalOut = 0,
      closing = 0;

    for (const tx of docs) {
      const signed =
        tx.type === "debit"
          ? -Math.abs(Number(tx.amount || 0))
          : Math.abs(Number(tx.amount || 0));
      const key = tx.merchant || tx.accountId || "Unknown";
      merchantMap.set(key, (merchantMap.get(key) || 0) + signed);

      if (signed >= 0) totalIn += signed;
      else totalOut += Math.abs(signed);
      closing += signed;

      const d = parseToDate(tx);
      if (!d) continue;

      const wkStart = startOfWeek(d);
      const wkKey = formatYYYYMMDD(wkStart);
      weekMap.set(wkKey, (weekMap.get(wkKey) || 0) + signed);

      const mKey = formatYYYYMM(d);
      monthMap.set(mKey, (monthMap.get(mKey) || 0) + signed);

      const dayKey = formatYYYYMMDD(d);
      dayMap.set(dayKey, (dayMap.get(dayKey) || 0) + signed);
    }

    const transactionsForChartArr = Array.from(merchantMap.entries())
      .map(([account, amount]) => ({ account, amount }))
      .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));

    const weeklyDataArr = Array.from(weekMap.entries())
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const monthlyDataArr = Array.from(monthMap.entries())
      .map(([month, value]) => ({ date: month + "-01", value }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const dailyDataArr = Array.from(dayMap.entries())
      .map(([day, value]) => ({ date: day, value }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const BANK_INFO = [
      {
        id: 1,
        header: "CLOSING CASH BALANCE",
        amount: closing.toFixed(2) || 0.0,
        change: closing.toFixed(2) || 0.0,
        trend: closing >= 0 ? "up" : "down",
      },
      {
        id: 2,
        header: "MONEY IN",
        amount: totalIn.toFixed(2) || 0.0,
        change: totalIn.toFixed(2) || 0.0,
        trend: totalIn >= 0 ? "up" : "down",
      },
      {
        id: 3,
        header: "MONEY OUT",
        amount: totalOut.toFixed(2) || 0.0,
        change: totalOut.toFixed(2) || 0.0,
        trend: totalOut <= totalIn ? "down" : "up",
      },
    ];

    return {
      transactionsForChart: transactionsForChartArr,
      weeklyData: weeklyDataArr,
      monthlyData: monthlyDataArr,
      dailyData: dailyDataArr,
      bankInfo: BANK_INFO,
      totalBalance: closing,
    };
  }, [docs]);

  // Compute filtered line chart and top transactions
  const lineData = useMemo(() => {
    if (selectedDate) {
      return dailyData.filter((d) => d.date === selectedDate);
    }
    return period === "weekly"
      ? weeklyData
      : period === "monthly"
        ? monthlyData
        : dailyData;
  }, [dailyData, weeklyData, monthlyData, period, selectedDate]);

  // Compute dynamic "From last X" text
  const fromText = selectedDate
    ? ""
    : period === "weekly"
      ? "From last week"
      : period === "monthly"
        ? "From last month"
        : "From last day";

  // Compute bank info changes (relative if not selectedDate)
  const bankInfoWithDelta = bankInfo.map((info) => {
    if (selectedDate) return { ...info, change: "", duration: "" };

    const currentAmount = Number(info.amount) || 0;
    const prevAmount = currentAmount ? currentAmount * 0.9 : 0; // placeholder previous period

    let changeValue = 0;
    if (prevAmount === 0) {
      changeValue = currentAmount === 0 ? 0 : currentAmount;
    } else {
      changeValue = showDollar
        ? currentAmount - prevAmount
        : ((currentAmount - prevAmount) / prevAmount) * 100;
    }

    return {
      ...info,
      change: changeValue.toFixed(2),
      duration: fromText,
    };
  });

  return (
    <div className="flex flex-col min-h-screen gap-8 pt-8">
      {/* Header + Filters */}
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-800 lg:text-4xl">
          WELCOME USER
        </h1>

        <div className="flex flex-row items-center justify-end gap-2">
          {/* Date input */}
          <input
            type="date"
            className="border border-primary rounded-sm px-2 py-0.5 text-xs h-7 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          {/* Period buttons */}
          {["daily", "weekly", "monthly"].map((p) => (
            <Button
              key={p}
              size="sm"
              className={`h-7 px-3 text-xs border border-primary rounded-sm  ${period === p && !selectedDate ? "bg-blue-100 text-primary" : "bg-white text-primary hover:text-white"}`}
              onClick={() => {
                setPeriod(p as any);
                setSelectedDate("");
              }}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* BANK INFO Cards */}
      <div className="grid lg:grid-cols-3 gap-4">
        {bankInfoWithDelta.map((info, idx) => (
          <Card key={idx} className="rounded-md bg-white border-0">
            <CardHeader className="flex flex-row justify-between items-center p-4 pb-0">
              <h4 className=" font-semibold">{info.header}</h4>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 px-4">
              <p className="text-gray-400 font-medium text-sm">Total</p>
              <p className="text-2xl font-bold">${info.amount}</p>
              {info.duration && (
                <div className="flex justify-between items-center">
                  <div className="w-full">
                    <div className="flex gap-1 justify-start items-center">
                      {info.trend === "up" ? (
                        <ArrowUp className="w-3 h-3" />
                      ) : (
                        <ArrowDown className="w-3 h-3" />
                      )}
                      <p className="font-medium">
                        {showDollar ? "$" : "%"}
                        {Number(info.change).toFixed()}
                      </p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                      <p className="text-sm text-gray-600 mr-auto">
                        {info.duration}
                      </p>
                      {/* Global $/% toggle */}
                      <div className="flex bg-white border-2 border-gray-50 overflow-hidden rounded-sm ">
                        <button
                          className={`rounded-none text-xs w-full flex justify-center items-center p-1 px-2 ${showDollar ? "bg-gray-100" : "bg-white"}`}
                          onClick={() => setShowDollar(true)}
                          disabled={!!selectedDate}
                        >
                          $
                        </button>
                        <button
                          className={`rounded-none text-xs w-full flex justify-center items-center p-1 px-2 ${!showDollar ? "bg-gray-100" : "bg-white"}`}
                          onClick={() => setShowDollar(false)}
                          disabled={!!selectedDate}
                        >
                          %
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Balance summary & Line Graph */}
      <div className="flex flex-col w-full bg-white rounded-md relative shadow px-4">
        <div className="py-4 font-semibold">
          <div className="flex justify-between items-center mb-8">
            <h3>BALANCE SUMMARY</h3>
          </div>
          <div className="flex flex-col justify-center gap-2 mb-8">
            <p className="text-xs text-gray-400">Current Balance</p>
            <p className="text-2xl lg:text-4xl font-bold text-blue-800">
              ${totalBalance.toFixed(2)}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center">
            <Spinner size={48} />
          </div>
        ) : (
          <LineAreaGraph
            data={lineData}
            mode={selectedDate ? "daily" : period}
          />
        )}
      </div>

      {/* Top inbound/outbound */}
      <div className="grid lg:grid-cols-2 gap-4 min-w-0">
        <div className="bg-white rounded-md p-2 shadow min-w-0">
          <div className="py-4 px-4 font-semibold">
            <div className="flex justify-between items-center mb-8">
              <h3>TOP INBOUND CASH SOURCES</h3>
            </div>
          </div>
          <HorizontalTop4BarChart
            data={transactionsForChart
              .filter((t) => t.amount > 0)
              .slice(0, 8)
              .map((t) => ({ account: t.account, amount: t.amount }))}
            type="inbound"
            mainColor="#020048"
            otherColor="#78769b"
          />
        </div>

        <div className="bg-white rounded-md shadow min-w-0">
          <div className="py-4 px-4 font-semibold">
            <div className="flex justify-between items-center mb-8">
              <h3>TOP OUTBOUND CASH</h3>
            </div>
          </div>
          <HorizontalTop4BarChart
            data={transactionsForChart
              .filter((t) => t.amount < 0)
              .slice(0, 8)
              .map((t) => ({ account: t.account, amount: Math.abs(t.amount) }))}
            type="outbound"
            mainColor="#0090d6"
            otherColor="#7ac4e7"
          />
        </div>
      </div>
    </div>
  );
}
