import type { OnboardingStep } from "./types";

// Onboarding screen text content
export const onboardingTexts = {
	buttons: {
		continue: "Continue",
		completeSetup: "Get Started",
		back: "Back",
	},
	progress: {
		step: "Step",
		of: "of",
	},
};

// Onboarding steps data
export const onboardingSteps: OnboardingStep[] = [
	{
		id: "full_name",
		title: "What's your name?",
		description: "Let's personalize your vision journey",
		type: "input",
		required: true,
		placeholder: "Enter your full name",
	},
	{
		id: "gender",
		title: "What's your gender?",
		description: "This helps us personalize your experience",
		type: "single-select",
		required: true,
		options: [
			{
				id: "male",
				label: "Male",
				//	description: "He/Him",
			},
			{
				id: "female",
				label: "Female",
				//	description: "She/Her",
			},

			{
				id: "prefer_not_to_say",
				label: "Prefer not to say",
				//	description: "Skip this question",
			},
		],
	},
	{
		id: "vision",
		title: "What's your vision?",
		description:
			"Write down what you want to achieve in life. This will be your daily reminder.",
		type: "textarea",
		required: true,
		placeholder: "Describe your vision, goals, and dreams...",
	},
	{
		id: "count_per_day",
		title: "How many times per day do you want to read your vision?",
		description: "Choose how often you'll review your vision to stay focused",
		type: "single-select",
		required: true,
		options: [
			{
				id: "5",
				label: "5 times per day",
				description: "Morning, noon, and evening reminders",
			},
			{
				id: "10",
				label: "10 times per day",
				description: "Balanced motivation for most people",
			},
			{
				id: "20",
				label: "20 times per day",
				description: "For those who want constant motivation",
			},
		],
	},
];

// Animation constants
export const onboardingAnimations = {
	stepTransition: {
		fadeOut: 150,
		fadeIn: 200,
		slideOffset: 50,
	},
	progressBar: {
		duration: 300,
	},
};
