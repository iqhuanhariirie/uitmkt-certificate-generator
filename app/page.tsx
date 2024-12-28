import uitmLogo from "@/assets/UiTM Logo Vector.svg";
import { FeatureCards } from "@/components/FeatureCards";
import { Footer } from "@/components/Footer";
import { GuestNavbar, AdminNavbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
	return (
		<div className="flex flex-col min-h-screen">
			<AdminNavbar />
			
			{/* Hero Section */}
			<section className="min-h-[95vh] pt-12 md:pt-16 px-6 md:px-10 flex flex-col items-center justify-center">
				<Image
					src={uitmLogo}
					width={300}
					alt="UITM Logo"
					priority
					className="mb-8 -mt-20"
				/>
				<h1 className="font-bold text-4xl md:text-5xl text-center max-w-4xl leading-relaxed mb-6 text-foreground">
					Implementation of Digital Signature in certificates.
				</h1>
				<p className="font-medium text-xl md:text-2xl text-center max-w-2xl leading-relaxed text-muted-foreground mb-12">
					A web application designed to simplify the process of generating
					e-certificates on demand with digital signature features.
				</p>
				<Link href="/admin" legacyBehavior passHref>
					<Button size="lg" className="px-8 py-6 text-lg">
						Get Started
					</Button>
				</Link>
			</section>

			{/* Features Section */}
			<section className="py-16 md:py-24 px-6 md:px-10 bg-secondary/50">
				<div className="max-w-7xl mx-auto">
					<h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
						Key Features
					</h2>
					<FeatureCards />
				</div>
			</section>

			<Footer />
		</div>
	);
}
