export type AuthStep =
	| "welcome"
	| "email"
	| "verification"
	| "name"
	| "success";

export interface AuthData {
	email: string;
	verificationCode: string;
	fullName: string;
}

export interface StepProps {
	data: AuthData;
	onDataChange: (data: Partial<AuthData>) => void;
	onNext?: () => void;
	onBack?: () => void;
	onClose?: () => void;
	mode?: "signup" | "login";
	onboardingData?: any;
	onSwitchMode?: (newMode: "signup" | "login") => void;
}

export interface AuthBottomSheetProps {
	isVisible: boolean;
	onClose: () => void;
	initialStep?: AuthStep;
	mode?: "signup" | "login";
}

export interface StepConfig {
	component: React.ComponentType<StepProps>;
	title?: string;
	showBackButton?: boolean;
	snapPoint?: string;
}
