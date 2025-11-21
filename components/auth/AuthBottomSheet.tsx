import React, { useRef, useCallback } from "react";
import { View, TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
	CustomBottomSheet,
	CustomBottomSheetRef,
} from "@/components/ui/bottom-sheet";
import { useColorScheme } from "@/lib/useColorScheme";
import { useAuthBottomSheetAnimation } from "./animations";
import { authConstants } from "./data";
import type {
	AuthStep,
	AuthData,
	AuthBottomSheetProps,
	StepConfig,
} from "./types";

interface AuthBottomSheetLayoutProps extends AuthBottomSheetProps {
	steps: Record<AuthStep, StepConfig>;
	currentStep: AuthStep;
	onStepChange: (step: AuthStep) => void;
	authData: AuthData;
	onAuthDataChange: (data: Partial<AuthData>) => void;
	onSwitchMode?: (newMode: "signup" | "login") => void;
	onboardingData?: any;
}

export const AuthBottomSheet: React.FC<AuthBottomSheetLayoutProps> = ({
	isVisible,
	onClose,
	steps,
	currentStep,
	onStepChange,
	authData,
	onAuthDataChange,
	mode = "signup",
	onSwitchMode,
	onboardingData,
}) => {
	const { colors } = useColorScheme();
	const bottomSheetRef = useRef<CustomBottomSheetRef>(null);

	// Animations
	const { contentAnimatedStyle, animateStepTransition } =
		useAuthBottomSheetAnimation();

	// Extract step order constant
	const stepOrder = authConstants.stepOrder;

	const handleBack = useCallback(() => {
		const currentIndex = stepOrder.indexOf(currentStep as any);

		if (currentIndex > 0) {
			const previousStep = stepOrder[currentIndex - 1];

			animateStepTransition(() => {
				// Clear current step data and errors when going back
				if (currentStep === "verification") {
					onAuthDataChange({ verificationCode: "" });
				} else if (currentStep === "email") {
					onAuthDataChange({ email: "" });
				}

				onStepChange(previousStep);
			});
		}
	}, [currentStep, onStepChange, stepOrder, onAuthDataChange, animateStepTransition]);

	const handleNext = useCallback(() => {
		console.log(
			"AuthBottomSheet: handleNext called, currentStep:",
			currentStep,
		);
		console.log("AuthBottomSheet: stepOrder:", stepOrder);

		const currentIndex = stepOrder.indexOf(currentStep as any);
		console.log("AuthBottomSheet: currentIndex:", currentIndex);

		if (currentIndex < stepOrder.length - 1) {
			const nextStep = stepOrder[currentIndex + 1];
			console.log("AuthBottomSheet: Moving to next step:", nextStep);

			animateStepTransition(() => {
				onStepChange(nextStep);
			});
		} else {
			console.log("AuthBottomSheet: Already at last step, cannot move next");
		}
	}, [currentStep, onStepChange, stepOrder, animateStepTransition]);

	const currentStepConfig = steps[currentStep];
	const CurrentStepComponent = currentStepConfig.component;
	const showBackButton = currentStep !== "welcome";
	const snapPoint =
		currentStepConfig.snapPoint ||
		(currentStep === "welcome"
			? authConstants.snapPoints.welcome
			: authConstants.snapPoints.other);

	const renderHeaderButtons = () => {
		return (
			<>
				{showBackButton ? (
					<TouchableOpacity onPress={handleBack} className="mb-8">
						<AntDesign name="arrowleft" size={32} color={colors.foreground} />
					</TouchableOpacity>
				) : currentStep === "welcome" ? (
					<TouchableOpacity
						onPress={onClose}
						className="absolute top-6 right-8 p-2 z-20"
					>
						<AntDesign name="close" size={24} color={colors.foreground} />
					</TouchableOpacity>
				) : null}
			</>
		);
	};

	return (
		<CustomBottomSheet
			ref={bottomSheetRef}
			isVisible={isVisible}
			onClose={onClose}
			snapPoints={[snapPoint]}
		>
			<View className="flex-1 pt-10 px-6 pb-6">
				{renderHeaderButtons()}

				<Animated.View className="flex-1" style={contentAnimatedStyle}>
					<CurrentStepComponent
						data={authData}
						onDataChange={onAuthDataChange}
						onNext={handleNext}
						onBack={showBackButton ? handleBack : undefined}
						onClose={onClose}
						mode={mode}
						onSwitchMode={onSwitchMode}
						onboardingData={onboardingData}
					/>
				</Animated.View>
			</View>
		</CustomBottomSheet>
	);
};
