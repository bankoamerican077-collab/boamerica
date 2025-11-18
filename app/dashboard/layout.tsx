import { Sidebar } from "@/components/dashboard/side-bar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<div className="flex flex-col min-h-screen pt-16 ">
				<Sidebar />
				<main className="flex-1 bg-gray-100/60 p-4 lg:pl-[304px]">
					<div className="fixed top-0 left-0 px-3 py-4.5 flex w-full bg-white z-10">
						<h2 className="text-xl font-bold text-primary">BANK OF AMERICA</h2>
						<img
							src="/images/svg/bank-of-america-logo-png-symbol-0.png"
							alt="bank of america"
							className="w-10 h-5"
						/>
					</div>
					{children}
				</main>
			</div>
		</>
	);
}
