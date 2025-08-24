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
	type: "single-select" | "multi-select" | "input" | "textarea";
	required: boolean;
	options?: OnboardingOption[];
	placeholder?: string;
}

export interface OnboardingProgress {
	currentStep: number;
	totalSteps: number;
	completedSteps: number;
	answers: OnboardingFormData;
}

export interface OnboardingFormData {
	full_name: string;
	gender: string;
	vision: string;
	count_per_day: number;
}

export interface OnboardingScreenProps {
	onComplete?: (answers: OnboardingFormData) => void;
	onBack?: () => void;
	initialStep?: number;
}

export interface AnimationConfig {
	duration: number;
	useNativeDriver: boolean;
}
