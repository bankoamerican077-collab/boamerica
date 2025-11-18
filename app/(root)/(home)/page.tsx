import HomeSection01 from "@/components/home/home-section-01";
import HomeSection03 from "@/components/home/home-section-03";

export default function Home() {
	return (
		<div className="flex flex-col min-h-screen gap-8">
			<HomeSection01 />
			<HomeSection03 />
		</div>
	);
}
