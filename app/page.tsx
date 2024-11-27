import uitmLogo from "@/assets/UiTM Logo Vector.svg";
import { FeatureCards } from "@/components/FeatureCards";
import { Footer } from "@/components/Footer";
import { GuestNavbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
	return (
		<>
			<div className="flex flex-col">
				<GuestNavbar />
				<section className="py-16 px-10 flex flex-col items-center mx-auto h-screen ">
					<Image
						src={uitmLogo}
						width={350}
						alt="UITM Logo"
						priority
					/>
					<span className="font-bold text-5xl text-center w-11/12 leading-snug">
						Empower your career with instant certificates, Seamlessly.
					</span>
					<span className="font-medium text-2xl text-center leading-snug">
						A web application designed to simplify the process of generating
						e-certificates on demand.
					</span>
					<div className="mt-4 flex gap-5">
						<Link href="/admin" legacyBehavior passHref>
							<Button>Get Started</Button>
						</Link>
					</div>
				</section>
				<section className="pb-16 px-10 flex flex-col items-center h-full gap-2">
					<FeatureCards />
				</section>
				<Footer />
			</div>
		</>
	);
}
