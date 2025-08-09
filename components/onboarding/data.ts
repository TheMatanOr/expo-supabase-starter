import type { OnboardingStep } from "./types";

// Onboarding screen text content
export const onboardingTexts = {
	buttons: {
		continue: "Continue",
		completeSetup: "Complete Setup",
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
		id: "fitness_level",
		title: "What's your fitness level?",
		description: "Help us personalize your workout experience",
		type: "single-select",
		required: true,
		options: [
			{
				id: "beginner",
				label: "Beginner",
				description: "New to fitness or getting back into it",
			},
			{
				id: "intermediate",
				label: "Intermediate",
				description: "Regular exercise routine, familiar with basics",
			},
			{
				id: "advanced",
				label: "Advanced",
				description: "Experienced with complex movements and training",
			},
		],
	},
	{
		id: "goals",
		title: "What are your fitness goals?",
		description: "Select all that apply to customize your experience",
		type: "multi-select",
		required: true,
		options: [
			{
				id: "weight_loss",
				label: "Weight Loss",
				description: "Burn calories and lose weight",
			},
			{
				id: "muscle_gain",
				label: "Muscle Gain",
				description: "Build strength and muscle mass",
			},
			{
				id: "endurance",
				label: "Endurance",
				description: "Improve cardiovascular health",
			},
			{
				id: "flexibility",
				label: "Flexibility",
				description: "Increase mobility and flexibility",
			},
			{
				id: "general_fitness",
				label: "General Fitness",
				description: "Overall health and wellness",
			},
		],
	},
	{
		id: "workout_frequency",
		title: "How often do you want to work out?",
		description: "We'll suggest a routine that fits your schedule",
		type: "single-select",
		required: true,
		options: [
			{
				id: "2-3_times",
				label: "2-3 times per week",
				description: "Perfect for beginners or busy schedules",
			},
			{
				id: "4-5_times",
				label: "4-5 times per week",
				description: "Great for building consistent habits",
			},
			{
				id: "6-7_times",
				label: "6-7 times per week",
				description: "For dedicated fitness enthusiasts",
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
