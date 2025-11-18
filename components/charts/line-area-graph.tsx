"use client";

import React, { useMemo } from "react";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
} from "recharts";

interface DataPoint {
	date: string;
	value: number;
}

interface Props {
	data: DataPoint[];
	mode?: "weekly" | "monthly";
}

export default function LineAreaGraph({ data, mode = "monthly" }: Props) {
	// ✅ Sort data by date ascending
	const sorted = [...data].sort(
		(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
	);

	// ✅ Generate last 12 weekly or monthly points
	const filteredData = useMemo(() => {
		if (sorted.length === 0) return [];

		const lastDate = new Date(sorted[sorted.length - 1].date);

		if (mode === "weekly") {
			const validWeeks: DataPoint[] = [];

			for (let i = sorted.length - 1; i >= 0; i--) {
				const entryDate = new Date(sorted[i].date);
				const diffWeeks = Math.floor(
					(lastDate.getTime() - entryDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
				);

				if (diffWeeks <= 12) validWeeks.push(sorted[i]);
			}

			return validWeeks.reverse();
		}

		// ✅ Monthly mode
		const validMonths: DataPoint[] = [];

		for (let i = sorted.length - 1; i >= 0; i--) {
			const d = new Date(sorted[i].date);

			const diffMonths =
				(lastDate.getFullYear() - d.getFullYear()) * 12 +
				(lastDate.getMonth() - d.getMonth());

			if (diffMonths <= 12) validMonths.push(sorted[i]);
		}

		return validMonths.reverse();
	}, [sorted, mode]);

	// ✅ X-Axis label formatting
	const formatXAxis = (date: string) => {
		const d = new Date(date);

		if (mode === "weekly") {
			return d.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
			});
		}

		return d.toLocaleString("en-US", { month: "short" });
	};

	return (
		<div
			className="w-full"
			style={{ minWidth: 0 }}
		>
			<ResponsiveContainer
				width="100%"
				aspect={2.2} // ✅ Keeps perfect ratio on any screen
			>
				<AreaChart
					data={filteredData}
					margin={{
						left: 0,
						right: 4,
						top: 20,
						bottom: 10,
					}}
				>
					<defs>
						<linearGradient
							id="areaBlueGradient"
							x1="0"
							y1="0"
							x2="0"
							y2="1"
						>
							<stop
								offset="0%"
								stopColor="#1e40af"
								stopOpacity={0.45}
							/>
							<stop
								offset="100%"
								stopColor="#eff6ff"
								stopOpacity={1}
							/>
						</linearGradient>
					</defs>

					<CartesianGrid
						strokeDasharray="3 3"
						opacity={0.2}
					/>

					<XAxis
						dataKey="date"
						tickFormatter={formatXAxis}
						tick={{ fill: "#1e293b", fontSize: 11 }}
						interval="preserveStartEnd" // ✅ Prevents overcrowding
						minTickGap={12}
					/>

					<YAxis
						tick={{ fill: "#1e293b", fontSize: 11 }}
						width={28} // ✅ Prevent Y-axis cutoff on small screens
					/>

					<Tooltip
						formatter={(v: number) => [`${v}`, "Value"]}
						labelFormatter={(label) => {
							const d = new Date(label);
							return d.toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
								year: "numeric",
							});
						}}
					/>

					<Area
						type="monotone"
						dataKey="value"
						fill="url(#areaBlueGradient)"
						stroke="#1e40af"
						strokeWidth={1.5}
						baseValue="dataMin" // ✅ Extend gradient to lowest negative
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
}
