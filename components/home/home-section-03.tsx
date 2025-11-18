import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

function HomeSection03() {
	return (
		<section className="flex flex-col items-center justify-center gap-8">
			<Card className="w-fit shadow-xl border-0 hover:border-blue-800 hover:border-2 min-w-3/4 rounded-xl  transform transition-discrete duration-100  overflow-hidden">
				<CardContent className="flex flex-col p-0 ">
					<div className="flex justify-end items-center w-full bg-blue-100 p-8 pt-2">
						<img
							src="/images/visa-cards/fullcardnewxustomers.png"
							alt=""
						/>
					</div>
					<div className="p-4 pb-10">
						<p className="text-xl mb-2">NEW CHECKING CUSTOMERS</p>
						<p className="text-lg text-red-600">Cash offer up to $500</p>
						<p className="text-sm">
							Start by opening a new eligible checking account.
						</p>
					</div>
				</CardContent>
			</Card>
			<Card className="w-fit shadow-xl border-0 hover:border-blue-800 hover:border-2 min-w-3/4 rounded-xl  transform transition-discrete duration-100 overflow-hidden">
				<CardContent className="flex flex-col p-0">
					<div className="flex justify-end items-center w-full bg-blue-100">
						<img
							src="/images/onechamp.webp"
							alt=""
						/>
					</div>
					<div className="p-4 pb-10">
						<p className="text-xl text-red-600 mb-2">
							From one Champion to another
						</p>
						<p className="text-sm">
							Employee volunteers deliver Money Habits®
						</p>
						<p className="text-sm">to Special Olympics athletes.</p>
						<Button
							variant="link"
							className="text-blue-600 p-0 "
						>
							Watch now
						</Button>
					</div>
				</CardContent>
			</Card>
		</section>
	);
}

export default HomeSection03;
