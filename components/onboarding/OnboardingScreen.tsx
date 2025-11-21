import React, { useState, useEffect } from "react";
import {
	View,
	ScrollView,
	Keyboard,
	KeyboardEvent,
	Platform,
} from "react-native";
import Animated from "react-native-reanimated";
import { useRouter } from "expo-router";

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { ProgressBar } from "@/components/ui/progress-bar";
import { OptionCard } from "@/components/ui/option-card";
import { BackButton } from "@/components/ui/back-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SignUpFlow } from "@/components/auth";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useOnboardingAnimations } from "./animations";
import { onboardingSteps, onboardingTexts } from "./data";
import type {
	OnboardingStep,
	OnboardingOption,
	OnboardingScreenProps,
	OnboardingFormData,
} from "./types";

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
	onComplete,
	onBack,
	initialStep = 0,
}) => {
	const router = useRouter();
	const {
		updateField,
		isOptionSelected,
		canContinueStep,
		completeOnboarding,
		getProgress,
		errors,
		getFormData,
		formState,
		watchedValues,
	} = useOnboarding();

	const [showSignUpSheet, setShowSignUpSheet] = useState(false);
	const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

	const currentStep: OnboardingStep = onboardingSteps[currentStepIndex];

	// Animations
	const {
		contentAnimatedStyle,
		buttonAnimatedStyle,
		animateStepTransition: animateTransition,
		handleKeyboardShow,
		handleKeyboardHide,
	} = useOnboardingAnimations(keyboardHeight, isKeyboardVisible);

	// Keyboard event handlers
	useEffect(() => {
		const keyboardWillShow = (event: KeyboardEvent) => {
			const keyboardHeightValue = event.endCoordinates.height;
			setKeyboardHeight(keyboardHeightValue);
			setIsKeyboardVisible(true);
			handleKeyboardShow(keyboardHeightValue);
		};

		const keyboardWillHide = () => {
			setIsKeyboardVisible(false);
			handleKeyboardHide();
		};

		// Add keyboard event listeners
		const showSubscription = Keyboard.addListener(
			Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
			keyboardWillShow,
		);
		const hideSubscription = Keyboard.addListener(
			Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
			keyboardWillHide,
		);

		// Cleanup listeners
		return () => {
			showSubscription.remove();
			hideSubscription.remove();
		};
	}, [handleKeyboardShow, handleKeyboardHide]);

	// Animate step transition wrapper
	const animateStepTransition = (direction: "next" | "prev"): void => {
		animateTransition(direction, () => {
			if (direction === "next") {
				setCurrentStepIndex((prev) => prev + 1);
			} else {
				setCurrentStepIndex((prev) => prev - 1);
			}
		});
	};

	const handleOptionSelectWrapper = (optionId: string): void => {
		const fieldKey = currentStep.id as keyof OnboardingFormData;
		console.log(`Selecting option: ${optionId} for step: ${currentStep.id}`);
		updateField(fieldKey, optionId);
	};

	const handleInputChange = (text: string): void => {
		const fieldKey = currentStep.id as keyof OnboardingFormData;
		console.log(`Input change for ${fieldKey}: ${text}`);
		updateField(fieldKey, text);
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
		const fieldKey = currentStep.id as keyof OnboardingFormData;
		return canContinueStep(fieldKey, currentStep.required);
	};

	const currentStepError =
		errors[currentStep.id as keyof OnboardingFormData]?.message;

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
				contentContainerStyle={{ paddingBottom: 100 }} // Add padding for floating button
			>
				<Animated.View style={contentAnimatedStyle}>
					{/* Step Title and Description */}
					<View className="mb-8">
						<H1 className="text-center ">{currentStep.title}</H1>
						{currentStep.description !== "" && (
							<Muted className="text-center text-base mt-3">
								{currentStep.description}
							</Muted>
						)}
					</View>

					{/* Input, Textarea, or Options */}
					{currentStep.type === "input" ? (
						<View className="gap-y-4">
							<Input
								placeholder={currentStep.placeholder || "Enter your answer"}
								value={String(
									watchedValues[currentStep.id as keyof OnboardingFormData] ||
										"",
								)}
								onChangeText={handleInputChange}
								autoCapitalize="words"
								autoComplete="name"
							/>
						</View>
					) : currentStep.type === "textarea" ? (
						<View className="gap-y-4">
							<Textarea
								placeholder={currentStep.placeholder || "Enter your answer"}
								value={String(
									watchedValues[currentStep.id as keyof OnboardingFormData] ||
										"",
								)}
								onChangeText={handleInputChange}
								autoCapitalize="sentences"
								numberOfLines={6}
								textAlignVertical="top"
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
										currentStep.id as keyof OnboardingFormData,
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
			<Animated.View
				className="absolute bottom-12 left-0 right-0 p-4"
				style={[
					buttonAnimatedStyle,
					{
						shadowOpacity: isKeyboardVisible ? 0.1 : 0,
						shadowRadius: 8,
						elevation: isKeyboardVisible ? 8 : 0,
					},
				]}
			>
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
			</Animated.View>

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
				onboardingData={getFormData()}
			/>
		</SafeAreaView>
	);
};
