"use client";

import uitmLogo from "@/assets/UiTM Logo Vector.svg";
import { AdminLoginButton } from "@/components/AdminLoginButton";
import { RingLoader } from "@/components/RingLoader";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";


export const LoginCard = () => {
	const { loading } = useAuth();
	const currentYear = new Date().getFullYear();
	if (loading) {
		return (
			<div className="h-full w-full flex items-center justify-center">
				<RingLoader />
			</div>
		);
	} else {
		return (
			<>
				<Card className="w-96 flex flex-col items-center justify-center ">
					<CardHeader className="flex flex-col items-center justify-center gap-3">
						<Image
							src={uitmLogo}
							width={200}
							alt="UITM Logo"
							priority
						/>
						<CardTitle className="text-center">
							Event E-Certificate System Admin Page
						</CardTitle>
					</CardHeader>
					<CardContent className="text-center">
						<AdminLoginButton />
					</CardContent>
					<CardFooter>
						<Link href="/">
							<Button variant="ghost" className="flex items-center gap-2">
								<ArrowLeft className="h-4 w-4" />
								Back to Welcome Page
							</Button>
						</Link>
					</CardFooter>
				</Card>
			</>
		);
	}
};
