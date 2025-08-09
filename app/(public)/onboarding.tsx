import React from "react";
import { useRouter } from "expo-router";
import { OnboardingScreen } from "@/components/onboarding";

export default function OnboardingScreenPage() {
	const router = useRouter();

	const handleBack = () => {
		// Go to the last slide of welcome screen (with login/signup options)
		router.replace("/welcome?slide=last");
	};

	return <OnboardingScreen onBack={handleBack} initialStep={0} />;
}
