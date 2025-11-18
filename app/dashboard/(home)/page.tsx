import HorizontalTop4BarChart from "@/components/charts/horizontal-top-bar";
import LineAreaGraph from "@/components/charts/line-area-graph";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Info } from "lucide-react";

export default function Home() {
	const transactions = [
		{ account: "Netflix", amount: -500 },
		{ account: "Netflix", amount: -300 },
		{ account: "Salary", amount: 25000 },
		{ account: "Salary", amount: 25000 },
		{ account: "Bank", amount: 4500 },
		{ account: "Uber", amount: -200 },
		{ account: "Uber", amount: -300 },
		{ account: "Uber", amount: -100 },
		{ account: "Peace", amount: -100 },
		{ account: "Peae", amount: -100 },
		{ account: "Pce", amount: -100 },
		{ account: "Uce", amount: -100 },
	];

	const weeklyData = [
		{ date: "2025-03-01", value: 50 },
		{ date: "2025-03-07", value: -10 },
		{ date: "2025-03-14", value: 80 },
		{ date: "2025-03-21", value: 40 },
		{ date: "2025-03-28", value: 440 },
	];
	const BANK_INFO = [
		{
			id: 1,
			header: "CLOSING CASH BALANCE",
			amount: "42,123.56",
			change: "232.23",
			trend: "up",
			duration: "Month",
		},
		{
			id: 3,
			header: "MONEY IN",
			amount: "8,765.43",
			change: "87.65",
			trend: "up",
			duration: "Month",
		},
		{
			id: 4,
			header: "MONEY OUT",
			amount: "4,321.09",
			change: "43.21",
			trend: "down",
			duration: "Month",
		},
	];
	return (
		<div className="flex flex-col min-h-screen gap-8 pt-8">
			<div className="flex flex-col gap-6">
				{/*welcome user */}
				<div>
					<h1 className="text-2xl font-bold text-gray-800 lg:text-4xl">
						WELCOME USER
					</h1>
				</div>
				{/* Filter Section */}
				<div className="flex flex-row items-center justify-end gap-2">
					{/* Date Filter */}
					<div className="flex flex-col">
						<input
							type="date"
							className="border border-primary rounded-sm px-2 py-0.5 text-xs h-7 bg-white 
						focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					{/* Quick Filters */}
					<div className="flex gap-1">
						<Button
							size="sm"
							className="h-7 px-3 text-xs bg-white border border-primary hover:bg-blue-50 text-primary rounded-sm"
						>
							Daily
						</Button>

						<Button
							size="sm"
							className="h-7 px-3 text-xs bg-white border border-primary hover:bg-blue-50 text-primary rounded-sm"
						>
							Weekly
						</Button>
						<Button
							size="sm"
							className="h-7 px-3 text-xs bg-white border border-primary hover:bg-blue-50 text-primary rounded-sm"
						>
							Monthly
						</Button>
					</div>
				</div>
			</div>
			<div className="grid lg:grid-cols-3 gap-4">
				{BANK_INFO.map((info, idx) => {
					return (
						<Card
							key={idx}
							className="rounded-md bg-white border-0 border-b-2 border-b-red-700"
						>
							<CardHeader className="flex flex-row justify-between items-center p-4 pb-0">
								<h4 className=" font-semibold">{info.header}</h4>
								<Info className="w-4 h-4" />
							</CardHeader>
							<CardContent className="flex flex-col gap-2 px-4">
								<p className="text-gray-400 font-medium text-sm">Total</p>
								<p className="text-2xl font-bold">${info.amount}</p>
								<div className="flex justify-between items-center">
									<div>
										<div className="flex gap-1 justify-start items-center">
											{info.trend === "up" ? (
												<ArrowUp className="w-3 h-3" />
											) : (
												<ArrowDown className="w-3 h-3" />
											)}
											<p className="font-medium">${info.change}</p>
										</div>
										<p className="text-sm text-gray-600">From last month</p>
									</div>
									<div className="flex bg-white border-2 border-gray-50 overflow-hidden rounded-sm ">
										<button className="bg-gray-100 rounded-none text-xs w-full flex justify-center items-center p-1 px-2">
											$
										</button>
										<button className="bg-white rounded-none text-xs w-full flex justify-center items-center p-1 px-2">
											%
										</button>
									</div>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>
			<div className="flex flex-col w-full bg-white rounded-md relative shadow px-4">
				<div className="py-4 font-semibold">
					<div className="flex justify-between items-center mb-8">
						<h3>BALANCE SUMMARY</h3>
						<Info className="w-4 h-4" />
					</div>
					<div className="flex flex-col justify-center gap-2 mb-8">
						<p className="text-xs text-gray-400">
							Current Balance as of JAN 26 ,2025
						</p>
						<p className="text-2xl lg:text-4xl font-bold text-blue-800">
							$362,899,121.212
						</p>
					</div>
				</div>
				<LineAreaGraph
					data={weeklyData}
					mode="weekly"
				/>
			</div>
			<div className="grid lg:grid-cols-2 gap-4 min-w-0">
				<div className="bg-white rounded-md p-2 shadow min-w-0">
					<div className="py-4 px-4 font-semibold">
						<div className="flex justify-between items-center mb-8">
							<h3>TOP INBOUND CASH SOURCES</h3>
							<Info className="w-4 h-4" />
						</div>
						<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-2 mb-8">
							<div>
								<p className="text-xs text-gray-400">Shopify</p>
								<p className="text-xl font-bold text-[#020048]">
									$362,899,121.212
								</p>
							</div>
							<div className="flex flex-col justify-center items-end">
								<p className="text-xs text-gray-400">Total Combined</p>
								<p className="text-xl font-bold">$362,899,121.212</p>
							</div>
						</div>
					</div>

					<HorizontalTop4BarChart
						data={transactions}
						type="inbound"
						mainColor="#020048"
						otherColor="#78769b"
					/>
				</div>
				<div className="bg-white rounded-md shadow min-w-0">
					<div className="py-4 px-4 font-semibold">
						<div className="flex justify-between items-center mb-8">
							<h3>TOP INBOUND CASH SOURCES</h3>
							<Info className="w-4 h-4" />
						</div>
						<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-2 mb-8">
							<div>
								<p className="text-xs text-gray-400">Shopify</p>
								<p className="text-xl font-bold text-[#0090d6]">
									$362,899,121.212
								</p>
							</div>
							<div className="flex flex-col justify-center items-end">
								<p className="text-xs text-gray-400">Total Combined</p>
								<p className="text-xl font-bold">$362,899,121.212</p>
							</div>
						</div>
					</div>
					<HorizontalTop4BarChart
						data={transactions}
						type="outbound"
						mainColor="#0090d6"
						otherColor="#7ac4e7"
					/>
				</div>
			</div>
		</div>
	);
}
