import React, { useState, useEffect } from "react";
import { AuthBottomSheet } from "./AuthBottomSheet";
import { WelcomeStep, EmailStep, VerificationStep } from "./steps";
import type {
	AuthStep,
	AuthData,
	AuthBottomSheetProps,
	StepConfig,
} from "./types";

const AUTH_STEPS: Record<AuthStep, StepConfig> = {
	welcome: {
		component: WelcomeStep,
		showBackButton: false,
		snapPoint: "55%",
	},
	email: {
		component: EmailStep,
		showBackButton: true,
		snapPoint: "90%",
	},
	verification: {
		component: VerificationStep,
		showBackButton: true,
		snapPoint: "90%",
	},
	name: {
		component: VerificationStep, // Not used anymore, but keep for type compatibility
		showBackButton: false,
		snapPoint: "90%",
	},
	success: {
		component: VerificationStep, // Not used anymore, but keep for type compatibility
		showBackButton: false,
		snapPoint: "90%",
	},
};

interface SignUpFlowProps extends Omit<AuthBottomSheetProps, "mode"> {
	onSuccess?: (data: AuthData) => void;
	onboardingData?: any;
	onSwitchToLogin?: () => void;
}

export const SignUpFlow: React.FC<SignUpFlowProps> = ({
	isVisible,
	onClose,
	initialStep = "welcome",
	onSuccess,
	onboardingData,
	onSwitchToLogin,
}) => {
	const [currentStep, setCurrentStep] = useState<AuthStep>(initialStep);
	const [authData, setAuthData] = useState<AuthData>({
		email: "",
		verificationCode: "",
		fullName: "",
	});

	// Reset to welcome step when modal closes
	useEffect(() => {
		if (!isVisible) {
			setCurrentStep("welcome");
			// Also clear auth data when modal closes
			setAuthData({
				email: "",
				verificationCode: "",
				fullName: "",
			});
		}
	}, [isVisible]);

	const handleAuthDataChange = (data: Partial<AuthData>) => {
		setAuthData((prev) => ({ ...prev, ...data }));
	};

	const handleStepChange = (step: AuthStep) => {
		console.log("SignUpFlow: Step change requested:", currentStep, "->", step);
		setCurrentStep(step);

		// Handle success step
		if (step === "success" && onSuccess) {
			onSuccess(authData);
		}
	};

	const handleSwitchMode = (newMode: "signup" | "login") => {
		if (newMode === "login" && onSwitchToLogin) {
			// Close signup and open login
			onSwitchToLogin();
		}
	};

	const handleClose = () => {
		// Reset form data when closing
		setAuthData({
			email: "",
			verificationCode: "",
			fullName: "",
		});
		setCurrentStep("welcome");
		onClose();
	};

	return (
		<AuthBottomSheet
			isVisible={isVisible}
			onClose={handleClose}
			steps={AUTH_STEPS}
			currentStep={currentStep}
			onStepChange={handleStepChange}
			authData={authData}
			onAuthDataChange={handleAuthDataChange}
			mode="signup"
			onSwitchMode={handleSwitchMode}
			onboardingData={onboardingData}
		/>
	);
};
