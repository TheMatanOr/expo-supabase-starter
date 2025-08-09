import React, { useState, useEffect } from "react";
import { AuthBottomSheet } from "./AuthBottomSheet";
import { WelcomeStep, EmailStep, VerificationStep } from "./steps";
import type {
	AuthStep,
	AuthData,
	AuthBottomSheetProps,
	StepConfig,
} from "./types";

// Simplified flow: welcome → email → verification (then direct to homepage)
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

interface LoginFlowProps extends Omit<AuthBottomSheetProps, "mode"> {
	onSuccess?: (data: AuthData) => void;
}

export const LoginFlow: React.FC<LoginFlowProps> = ({
	isVisible,
	onClose,
	initialStep = "welcome",
	onSuccess,
}) => {
	const [currentStep, setCurrentStep] = useState<AuthStep>(initialStep);
	const [authData, setAuthData] = useState<AuthData>({
		email: "",
		verificationCode: "",
		fullName: "", // Not used in login flow
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
		setCurrentStep(step);

		// Handle success step
		if (step === "success" && onSuccess) {
			onSuccess(authData);
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
			mode="login"
		/>
	);
};
