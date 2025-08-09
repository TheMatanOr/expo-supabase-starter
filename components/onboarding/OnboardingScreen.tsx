import React, { useState, useRef } from "react";
import { View, Animated, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { ProgressBar } from "@/components/ui/progress-bar";
import { OptionCard } from "@/components/ui/option-card";
import { BackButton } from "@/components/ui/back-button";
import { Input } from "@/components/ui/input";
import { SignUpFlow } from "@/components/auth";
import { useOnboarding } from "@/hooks/useOnboarding";
import { onboardingSteps, onboardingTexts, onboardingAnimations } from "./data";
import type {
	OnboardingStep,
	OnboardingOption,
	OnboardingScreenProps,
} from "./types";

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
	onComplete,
	onBack,
	initialStep = 0,
}) => {
	const router = useRouter();
	const {
		handleOptionSelect,
		isOptionSelected,
		canContinueStep,
		completeOnboarding,
		getProgress,
		errors,
		getOnboardingData,
		getRawFormData,
		formState,
		watchedValues,
	} = useOnboarding();

	const [showSignUpSheet, setShowSignUpSheet] = useState(false);
	const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
	const fadeAnim = useRef(new Animated.Value(1)).current;
	const slideAnim = useRef(new Animated.Value(0)).current;

	const currentStep: OnboardingStep = onboardingSteps[currentStepIndex];

	// Animate step transition
	const animateStepTransition = (direction: "next" | "prev"): void => {
		// Fade out current content
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 0,
				duration: onboardingAnimations.stepTransition.fadeOut,
				useNativeDriver: true,
			}),
			Animated.timing(slideAnim, {
				toValue:
					direction === "next"
						? -onboardingAnimations.stepTransition.slideOffset
						: onboardingAnimations.stepTransition.slideOffset,
				duration: onboardingAnimations.stepTransition.fadeOut,
				useNativeDriver: true,
			}),
		]).start(() => {
			// Update step index
			if (direction === "next") {
				setCurrentStepIndex((prev) => prev + 1);
			} else {
				setCurrentStepIndex((prev) => prev - 1);
			}

			// Fade in new content
			Animated.parallel([
				Animated.timing(fadeAnim, {
					toValue: 1,
					duration: onboardingAnimations.stepTransition.fadeIn,
					useNativeDriver: true,
				}),
				Animated.timing(slideAnim, {
					toValue: 0,
					duration: onboardingAnimations.stepTransition.fadeIn,
					useNativeDriver: true,
				}),
			]).start();
		});
	};

	const handleOptionSelectWrapper = (optionId: string): void => {
		const isMultiSelect = currentStep.type === "multi-select";
		const stepKey = currentStep.id as
			| "full_name"
			| "fitness_level"
			| "goals"
			| "workout_frequency";
		console.log(
			`Selecting option: ${optionId} for step: ${currentStep.id} (multiSelect: ${isMultiSelect})`,
		);
		handleOptionSelect(stepKey, optionId, isMultiSelect);
	};

	const handleInputChange = (text: string): void => {
		const stepKey = currentStep.id as "full_name";
		console.log(`Input change for ${stepKey}: ${text}`);
		handleOptionSelect(stepKey, text, false); // Treat input as single selection
	};

	const handleContinue = async (): Promise<void> => {
		if (currentStepIndex < onboardingSteps.length - 1) {
			animateStepTransition("next");
		} else {
			// Complete onboarding
			const result = await completeOnboarding();

			if (result.success) {
				console.log("Onboarding completed successfully:", result.data);
				setShowSignUpSheet(true);
				if (onComplete) {
					onComplete(result.data as any);
				}
			} else {
				console.error("Failed to complete onboarding:", result.error);
			}
		}
	};

	const handleBack = (): void => {
		if (currentStepIndex > 0) {
			animateStepTransition("prev");
		} else {
			// Go back to welcome screen
			if (onBack) {
				onBack();
			} else {
				router.replace("/welcome?slide=last");
			}
		}
	};

	const canContinue = (): boolean => {
		const stepKey = currentStep.id as
			| "full_name"
			| "fitness_level"
			| "goals"
			| "workout_frequency";
		return canContinueStep(stepKey, currentStep.required);
	};

	const currentStepError =
		errors[
			currentStep.id as
				| "full_name"
				| "fitness_level"
				| "goals"
				| "workout_frequency"
		]?.message;

	return (
		<SafeAreaView className="flex flex-1 bg-background">
			{/* Progress Bar */}
			<ProgressBar
				currentStep={
					getProgress(currentStepIndex, onboardingSteps.length).currentStep
				}
				totalSteps={
					getProgress(currentStepIndex, onboardingSteps.length).totalSteps
				}
			/>

			{/* Global Error */}
			{currentStepError && (
				<View className="px-4 pt-2">
					<Text className="text-red-500 text-sm text-center">
						{currentStepError}
					</Text>
				</View>
			)}

			{/* Back Button - Always show now */}
			<View className="px-4 pt-2">
				<BackButton onPress={handleBack} />
			</View>

			{/* Main Content */}
			<ScrollView
				className="flex-1 px-4 pt-6"
				showsVerticalScrollIndicator={false}
			>
				<Animated.View
					style={{
						opacity: fadeAnim,
						transform: [
							{
								translateX: slideAnim,
							},
						],
					}}
				>
					{/* Step Title and Description */}
					<View className="mb-8">
						<H1 className="text-center ">{currentStep.title}</H1>
						{currentStep.description !== "" && (
							<Muted className="text-center text-base mt-3">
								{currentStep.description}
							</Muted>
						)}
					</View>

					{/* Input or Options */}
					{currentStep.type === "input" ? (
						<View className="gap-y-4">
							<Input
								placeholder={currentStep.placeholder || "Enter your answer"}
								value={
									watchedValues[
										currentStep.id as keyof typeof watchedValues
									]?.[0] || ""
								}
								onChangeText={handleInputChange}
								autoCapitalize="words"
								autoComplete="name"
							/>
						</View>
					) : (
						<View className="gap-y-4">
							{currentStep.options?.map((option: OnboardingOption) => (
								<OptionCard
									key={option.id}
									id={option.id}
									label={option.label}
									description={option.description}
									isSelected={isOptionSelected(
										currentStep.id as
											| "full_name"
											| "fitness_level"
											| "goals"
											| "workout_frequency",
										option.id,
									)}
									onPress={handleOptionSelectWrapper}
								/>
							))}
						</View>
					)}

					{/* Step Error */}
					{currentStepError && (
						<Text className="text-red-500 text-sm text-center mt-4">
							{currentStepError}
						</Text>
					)}
				</Animated.View>
			</ScrollView>

			{/* Continue Button */}
			<View className="p-4">
				<Button
					variant="default"
					className="w-full"
					size="lg"
					onPress={handleContinue}
					disabled={!canContinue() || formState.isSubmitting}
				>
					<Text>
						{formState.isSubmitting
							? "Saving..."
							: currentStepIndex === onboardingSteps.length - 1
								? onboardingTexts.buttons.completeSetup
								: onboardingTexts.buttons.continue}
					</Text>
				</Button>
			</View>

			{/* Sign-Up Flow */}
			<SignUpFlow
				isVisible={showSignUpSheet}
				initialStep="email" // Start directly with email since onboarding is complete
				onClose={() => {
					console.log("OnboardingScreen: SignUp sheet closing");
					setShowSignUpSheet(false);
				}}
				onSuccess={(data) => {
					console.log("OnboardingScreen: Sign up successful:", data);
					// TODO: Handle successful signup (e.g., navigate to main app)
				}}
				onboardingData={getRawFormData()}
			/>
		</SafeAreaView>
	);
};
