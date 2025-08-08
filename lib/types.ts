// Welcome types
export interface WelcomeSlide {
	title: string;
	description: string;
	image: any; // React Native image require type
}

export interface WelcomeData {
	slides: WelcomeSlide[];
}

// Onboarding types
export interface OnboardingOption {
	id: string;
	label: string;
	description?: string;
	icon?: string;
}

export interface OnboardingStep {
	id: string;
	title: string;
	description: string;
	type: "single-select" | "multi-select" | "text" | "number";
	options?: OnboardingOption[];
	required?: boolean;
}

export interface OnboardingData {
	steps: OnboardingStep[];
}

export interface OnboardingProgress {
	currentStep: number;
	totalSteps: number;
	completedSteps: number;
	answers: Record<string, any>;
}

// Add more types here as the app grows
