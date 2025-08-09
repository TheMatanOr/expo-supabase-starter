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
	type: "single-select" | "multi-select" | "input";
	required: boolean;
	options?: OnboardingOption[];
	placeholder?: string;
}

export interface OnboardingProgress {
	currentStep: number;
	totalSteps: number;
	completedSteps: number;
	answers: Record<string, string[]>;
}

export interface OnboardingScreenProps {
	onComplete?: (answers: Record<string, string[]>) => void;
	onBack?: () => void;
	initialStep?: number;
}

export interface AnimationConfig {
	duration: number;
	useNativeDriver: boolean;
}
