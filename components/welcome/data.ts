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
		title: "Welcome to Beast Mode",
		description:
			"Transform your fitness journey with personalized workouts and tracking.",
		image: require("@/assets/onboarding/1.png"),
	},
	{
		id: 2,
		title: "Track Your Progress",
		description:
			"Monitor your workouts, set goals, and see your improvements over time.",
		image: require("@/assets/onboarding/2.png"),
	},
	{
		id: 3,
		title: "Stay Motivated",
		description:
			"Join a community of fitness enthusiasts and achieve your goals together.",
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
