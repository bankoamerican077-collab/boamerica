"use client";

import { useMemo } from "react";
import {
	ResponsiveContainer,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
	LabelList,
	Cell,
} from "recharts";

export type Transaction = {
	account: string;
	amount: number;
};

interface Props {
	data: Transaction[];
	type?: "inbound" | "outbound";
	mainColor?: string;
	otherColor?: string;
	maxItems?: number;
}

export default function HorizontalTop5BarChart({
	data,
	type = "inbound",
	mainColor = "#1e40af",
	otherColor = "#93c5fd",
	maxItems = 5,
}: Props) {
	// Name above bar
	const CustomTopLeftLabel = (props: any) => {
		const { x, y, value } = props;
		return (
			<text
				x={x}
				y={y - 8}
				fontSize={13}
				fontWeight={600}
				fill="#0f172a"
				textAnchor="start"
				dominantBaseline="middle"
			>
				{value}
			</text>
		);
	};

	// 1) Filter inbound/outbound
	const filtered = useMemo(() => {
		return (data || []).filter((t) =>
			type === "inbound" ? t.amount > 0 : t.amount < 0
		);
	}, [data, type]);

	// 2) SUM totals per account
	const totals = useMemo(() => {
		const map = new Map<string, number>();

		for (const tx of filtered) {
			const key = tx.account ?? "Unknown";
			map.set(key, (map.get(key) ?? 0) + tx.amount);
		}

		let arr = Array.from(map.entries()).map(([name, total]) => ({
			name,
			total,
			abs: Math.abs(total),
		}));

		arr.sort((a, b) =>
			type === "inbound" ? b.total - a.total : b.abs - a.abs
		);

		return arr.slice(0, maxItems);
	}, [filtered, maxItems, type]);

	// 3) Chart data: chartValue is always positive (so bars grow left→right)
	const chartData = useMemo(() => {
		return totals.map((item, i) => ({
			name: item.name,
			labelValue: item.total, // keep sign for tooltip
			chartValue: type === "inbound" ? item.total : Math.abs(item.total),
			fill: i === 0 ? mainColor : otherColor,
		}));
	}, [totals, type, mainColor, otherColor]);

	if (!chartData.length) {
		return (
			<div className="w-full h-48 flex items-center justify-center text-sm text-muted-foreground">
				No transactions to display
			</div>
		);
	}

	const maxValue = Math.max(...chartData.map((d) => d.chartValue), 0);

	return (
		<div
			className="w-full"
			style={{ minWidth: 0, height: 294 }}
		>
			<ResponsiveContainer
				width="100%"
				height="100%"
			>
				<BarChart
					data={chartData}
					layout="vertical"
					barGap={12}
					barCategoryGap={28}
					margin={{ top: 20, right: 20, left: 12, bottom: 40 }}
				>
					<CartesianGrid
						horizontal={false}
						opacity={0.12}
					/>

					<XAxis
						type="number"
						domain={[0, maxValue]}
						tick={{ fontSize: 12, fill: "#1e293b" }}
					/>

					<YAxis
						type="category"
						dataKey="name"
						tick={false}
						axisLine={false}
						width={0}
					/>

					<Tooltip
						formatter={(value, _name, item) => [
							item.payload.labelValue,
							"Total Amount",
						]}
						labelFormatter={(label) => `Account: ${label}`}
					/>

					<Bar
						dataKey="chartValue"
						barSize={20}
						isAnimationActive={false}
					>
						{/* account name above bar */}
						<LabelList
							dataKey="name"
							content={<CustomTopLeftLabel />}
						/>

						{chartData.map((entry, idx) => (
							<Cell
								key={idx}
								fill={entry.fill}
							/>
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
