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
import { SignUpFlow } from "@/components/auth";
import { onboardingSteps, onboardingTexts, onboardingAnimations } from "./data";
import type {
	OnboardingStep,
	OnboardingOption,
	OnboardingProgress,
	OnboardingScreenProps,
} from "./types";

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
	onComplete,
	onBack,
	initialStep = 0,
}) => {
	const router = useRouter();
	const [currentStepIndex, setCurrentStepIndex] = useState<number>(initialStep);
	const [selectedOptions, setSelectedOptions] = useState<
		Record<string, string[]>
	>({});
	const [showSignUpSheet, setShowSignUpSheet] = useState(false);
	const fadeAnim = useRef(new Animated.Value(1)).current;
	const slideAnim = useRef(new Animated.Value(0)).current;

	const currentStep: OnboardingStep = onboardingSteps[currentStepIndex];
	const progress: OnboardingProgress = {
		currentStep: currentStepIndex + 1,
		totalSteps: onboardingSteps.length,
		completedSteps: Object.keys(selectedOptions).length,
		answers: selectedOptions,
	};

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
			// Update step
			const newStepIndex =
				direction === "next"
					? Math.min(currentStepIndex + 1, onboardingSteps.length - 1)
					: Math.max(currentStepIndex - 1, 0);

			setCurrentStepIndex(newStepIndex);

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

	const handleOptionSelect = (optionId: string): void => {
		if (currentStep.type === "single-select") {
			const currentSelections = selectedOptions[currentStep.id] || [];
			const isCurrentlySelected = currentSelections.includes(optionId);

			// If already selected, deselect it; otherwise, select it
			const newSelections = isCurrentlySelected ? [] : [optionId];

			setSelectedOptions({
				...selectedOptions,
				[currentStep.id]: newSelections,
			});
		} else if (currentStep.type === "multi-select") {
			const currentSelections = selectedOptions[currentStep.id] || [];
			const newSelections = currentSelections.includes(optionId)
				? currentSelections.filter((id) => id !== optionId)
				: [...currentSelections, optionId];

			setSelectedOptions({
				...selectedOptions,
				[currentStep.id]: newSelections,
			});
		}
	};

	const handleContinue = (): void => {
		if (currentStepIndex < onboardingSteps.length - 1) {
			animateStepTransition("next");
		} else {
			// Complete onboarding and show sign-up bottom sheet
			console.log("Onboarding completed:", selectedOptions);
			setShowSignUpSheet(true);
			if (onComplete) {
				onComplete(selectedOptions);
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

	const isOptionSelected = (optionId: string): boolean => {
		const currentSelections = selectedOptions[currentStep.id] || [];
		return currentSelections.includes(optionId);
	};

	const canContinue = (): boolean => {
		const currentSelections = selectedOptions[currentStep.id] || [];
		return currentStep.required ? currentSelections.length > 0 : true;
	};

	return (
		<SafeAreaView className="flex flex-1 bg-background">
			{/* Progress Bar */}
			<ProgressBar
				currentStep={progress.currentStep}
				totalSteps={progress.totalSteps}
			/>

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
						<H1 className="text-center mb-3">{currentStep.title}</H1>
						<Muted className="text-center text-base">
							{currentStep.description}
						</Muted>
					</View>

					{/* Options */}
					<View className="gap-y-4">
						{currentStep.options?.map((option: OnboardingOption) => (
							<OptionCard
								key={option.id}
								id={option.id}
								label={option.label}
								description={option.description}
								isSelected={isOptionSelected(option.id)}
								onPress={handleOptionSelect}
							/>
						))}
					</View>
				</Animated.View>
			</ScrollView>

			{/* Continue Button */}
			<View className="p-4">
				<Button
					variant="default"
					className="w-full "
					size="lg"
					onPress={handleContinue}
					disabled={!canContinue()}
				>
					<Text>
						{currentStepIndex === onboardingSteps.length - 1
							? onboardingTexts.buttons.completeSetup
							: onboardingTexts.buttons.continue}
					</Text>
				</Button>
			</View>

			{/* Sign-Up Flow */}
			<SignUpFlow
				isVisible={showSignUpSheet}
				onClose={() => setShowSignUpSheet(false)}
				onSuccess={(data) => {
					console.log("Sign up successful:", data);
					// TODO: Handle successful signup (e.g., navigate to main app)
				}}
			/>
		</SafeAreaView>
	);
};
