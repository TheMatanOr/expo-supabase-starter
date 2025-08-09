import React, { useRef, useState, useCallback } from "react";
import { View, Animated, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
	CustomBottomSheet,
	CustomBottomSheetRef,
} from "@/components/ui/bottom-sheet";
import { colors } from "@/constants/colors";
import { useColorScheme } from "@/lib/useColorScheme";
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
}) => {
	const { colorScheme } = useColorScheme();
	const bottomSheetRef = useRef<CustomBottomSheetRef>(null);
	const fadeAnim = useRef(new Animated.Value(1)).current;

	const handleClose = useCallback(() => {
		bottomSheetRef.current?.close();
	}, []);

	const handleBack = useCallback(() => {
		// Simplified flow: welcome → email → verification (then direct to homepage)
		const stepOrder: AuthStep[] = ["welcome", "email", "verification"];

		const currentIndex = stepOrder.indexOf(currentStep);

		if (currentIndex > 0) {
			const previousStep = stepOrder[currentIndex - 1];

			Animated.timing(fadeAnim, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}).start(() => {
				onStepChange(previousStep);
				Animated.timing(fadeAnim, {
					toValue: 1,
					duration: 200,
					useNativeDriver: true,
				}).start();
			});
		}
	}, [currentStep, fadeAnim, onStepChange]);

	const handleNext = useCallback(() => {
		// Simplified flow: welcome → email → verification (then direct to homepage)
		const stepOrder: AuthStep[] = ["welcome", "email", "verification"];

		const currentIndex = stepOrder.indexOf(currentStep);

		if (currentIndex < stepOrder.length - 1) {
			const nextStep = stepOrder[currentIndex + 1];

			Animated.timing(fadeAnim, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}).start(() => {
				onStepChange(nextStep);
				Animated.timing(fadeAnim, {
					toValue: 1,
					duration: 200,
					useNativeDriver: true,
				}).start();
			});
		}
	}, [currentStep, fadeAnim, onStepChange]);

	const currentStepConfig = steps[currentStep];
	const CurrentStepComponent = currentStepConfig.component;
	const showBackButton =
		currentStepConfig.showBackButton && currentStep !== "welcome";
	const snapPoint =
		currentStepConfig.snapPoint || (currentStep === "welcome" ? "55%" : "90%");

	const renderHeaderButtons = () => {
		// Show back button on all steps except welcome
		const showBackButton = currentStep !== "welcome";

		return (
			<>
				{showBackButton ? (
					<TouchableOpacity onPress={handleBack} className="mb-8">
						<AntDesign
							name="arrowleft"
							size={32}
							color={colors[colorScheme || "dark"].foreground}
						/>
					</TouchableOpacity>
				) : currentStep === "welcome" ? (
					<TouchableOpacity
						onPress={handleClose}
						className="absolute top-6 right-8 p-2 z-20"
					>
						<AntDesign
							name="close"
							size={24}
							color={colors[colorScheme || "dark"].foreground}
						/>
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

				<Animated.View
					className="flex-1"
					style={{
						opacity: fadeAnim,
					}}
				>
					<CurrentStepComponent
						data={authData}
						onDataChange={onAuthDataChange}
						onNext={handleNext}
						onBack={showBackButton ? handleBack : undefined}
						onClose={onClose}
						mode={mode}
					/>
				</Animated.View>
			</View>
		</CustomBottomSheet>
	);
};
