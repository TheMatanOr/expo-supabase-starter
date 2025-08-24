import type { WelcomeSlide } from "./types";

// Welcome screen text content
export const welcomeTexts = {
	buttons: {
		continue: "Continue",
		getStarted: "Get Started",
		login: "Login",
	},
	footer: {
		alreadyHaveAccount: "Already have an account?",
	},
};

// Welcome slides data
export const welcomeSlides: WelcomeSlide[] = [
	{
		id: 1,
		title: "Welcome to Vision App",
		description:
			"Transform your life by writing your vision and reading it daily to stay focused and motivated.",
		image: require("@/assets/onboarding/1.png"),
	},
	{
		id: 2,
		title: "Track Your Vision",
		description:
			"Monitor how many times you read your vision each day and build consistent habits.",
		image: require("@/assets/onboarding/2.png"),
	},
	{
		id: 3,
		title: "Stay Focused",
		description:
			"Join a community of vision-driven individuals and achieve your dreams together.",
		image: require("@/assets/onboarding/3.png"),
	},
];

// Animation constants
export const welcomeAnimations = {
	slideTransition: {
		fadeOut: 150,
		fadeIn: 200,
		dotTransition: 200,
	},
	scale: {
		min: 0.98,
		max: 1.2,
	},
	translateY: {
		offset: 15,
	},
};
