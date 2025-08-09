import React from "react";
import { useRouter } from "expo-router";
import { WelcomeScreen } from "@/components/welcome";

export default function WelcomeScreenPage() {
	const router = useRouter();

	const handleContinue = () => {
		router.push("/onboarding");
	};

	return <WelcomeScreen onContinue={handleContinue} />;
}
