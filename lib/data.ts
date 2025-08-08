import { WelcomeSlide } from "@/lib/types";

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

// Add more data exports here as the app grows
