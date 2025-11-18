import VISA_CARD from "@/lib/data/VisaCard";

function HomeSection01() {
	return (
		<section className="flex flex-col gap-8">
			<div className="text-3xl flex flex-col md:flex-row gap-x-2">
				<h1>Choose the card </h1>
				<h1>that works for you</h1>
			</div>
			<div className="flex flex-col gap-4">
				{VISA_CARD.map((card, idx) => {
					return (
						<div
							key={idx}
							className="flex items-center gap-2"
						>
							<img
								src={card.image}
								alt="visa card"
								className="flex-1 max-w-62 aspect-video"
							/>
							<p className="flex-1 text-primary/90 text-2xl hover:underline">
								${`${card.amount} ${card.header}`}
							</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}

export default HomeSection01;
