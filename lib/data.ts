import { WelcomeSlide, OnboardingStep } from "@/lib/types";

// Preload all images
const images = {
	image1: require("@/assets/onboarding/1.png"),
	image2: require("@/assets/onboarding/2.png"),
	image3: require("@/assets/onboarding/3.png"),
};

// Welcome slides data
export const welcomeSlides: WelcomeSlide[] = [
	{
		title: "Welcome to Beast Mode",
		description:
			"Your ultimate companion for tracking workouts, building strength, and achieving your fitness goals. Start your transformation journey today.",
		image: images.image1,
	},
	{
		title: "Track & Progress",
		description:
			"Monitor your workouts, track your progress, and celebrate your achievements. Every rep, every set, every milestone matters.",
		image: images.image2,
	},
	{
		title: "Ready to Transform?",
		description:
			"Join thousands of athletes who have already transformed their lives. Your journey to becoming unstoppable starts now.",
		image: images.image3,
	},
];

// Onboarding flow data for Spanish learning app
export const onboardingSteps: OnboardingStep[] = [
	{
		id: "spanish-level",
		title: "What's your Spanish level?",
		description: "Help us personalize your learning experience",
		type: "single-select",
		required: true,
		options: [
			{
				id: "beginner",
				label: "Beginner",
				description: "I'm just starting to learn Spanish",
			},
			{
				id: "intermediate",
				label: "Intermediate",
				description: "I can hold basic conversations",
			},
			{
				id: "advanced",
				label: "Advanced",
				description: "I'm fluent but want to improve",
			},
			{
				id: "native",
				label: "Native Speaker",
				description: "Spanish is my first language",
			},
		],
	},
	{
		id: "interests",
		title: "What interests you most?",
		description: "Choose topics that motivate you to learn",
		type: "multi-select",
		required: true,
		options: [
			{
				id: "travel",
				label: "Travel & Culture",
				description: "Explore Spanish-speaking countries",
			},
			{
				id: "business",
				label: "Business & Work",
				description: "Professional Spanish skills",
			},
			{
				id: "conversation",
				label: "Daily Conversation",
				description: "Speak with friends and family",
			},
			{
				id: "literature",
				label: "Literature & Media",
				description: "Books, movies, and entertainment",
			},
			{
				id: "academic",
				label: "Academic & Study",
				description: "For school or university",
			},
		],
	},
	{
		id: "learning-goal",
		title: "What's your main goal?",
		description: "This helps us focus your learning path",
		type: "single-select",
		required: true,
		options: [
			{
				id: "fluency",
				label: "Become Fluent",
				description: "Speak Spanish confidently",
			},
			{
				id: "basic-conversation",
				label: "Basic Conversation",
				description: "Handle everyday situations",
			},
			{
				id: "travel-communication",
				label: "Travel Communication",
				description: "Navigate Spanish-speaking countries",
			},
			{
				id: "cultural-understanding",
				label: "Cultural Understanding",
				description: "Connect with Spanish culture",
			},
		],
	},
];

// Signup screen data
export const signupData = {
	title: "You're Ready to Go! 🎉",
	subtitle: "Let's create your account and start your learning journey",
	emailPlaceholder: "Enter your email address",
	passwordPlaceholder: "Create a password",
	confirmPasswordPlaceholder: "Confirm your password",
	continueWithEmail: "Continue with Email",
	continueWithGoogle: "Continue with Google",
	continueWithApple: "Continue with Apple",
	createAccount: "Create Account",
	alreadyHaveAccount: "Already have an account?",
	loginText: "Login",
	termsText:
		"By continuing, you agree to our Terms of Service and Privacy Policy",
	confettiDuration: 3000, // 3 seconds
};

// Add more data exports here as the app grows
