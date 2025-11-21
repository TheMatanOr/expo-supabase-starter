import { useAnimatedStyle } from "react-native-reanimated";
import { useFadeScaleAnimation } from "@/hooks/useAnimations";
import { useDotAnimation } from "@/hooks/useDotAnimation";
import { welcomeAnimations } from "./data";

export const useWelcomeAnimations = (initialSlide: number, currentSlide: number) => {
	// Content and image animations
	const contentAnimation = useFadeScaleAnimation(
		1,
		1,
		welcomeAnimations.scale.min,
	);
	const imageAnimation = useFadeScaleAnimation(
		1,
		1,
		welcomeAnimations.scale.min,
	);

	// Dot animations
	const { dotStyles, updateDot } = useDotAnimation({
		count: 3,
		activeIndex: currentSlide,
		activeColor: "rgba(168, 5, 135, 1)",
		inactiveColor: "rgba(156, 163, 175, 0.3)",
		scaleMax: welcomeAnimations.scale.max,
		scaleMin: 0.8,
		sizeMin: 8,
		sizeMax: 12,
		duration: welcomeAnimations.slideTransition.dotTransition,
	});

	// Text animation (translateY based on content opacity)
	const textAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY:
						(1 - contentAnimation.opacity.value) *
						welcomeAnimations.translateY.offset,
				},
			],
		};
	});

	// Animate slide transition
	const animateSlideTransition = (newSlide: number, onSlideChange: (slide: number) => void) => {
		// Fade out
		contentAnimation.fadeScaleOut(welcomeAnimations.slideTransition.fadeOut);
		imageAnimation.fadeScaleOut(welcomeAnimations.slideTransition.fadeOut);

		// Update slide and dots after fade out
		setTimeout(() => {
			onSlideChange(newSlide);
			updateDot(newSlide);

			// Fade in
			contentAnimation.fadeScaleIn(welcomeAnimations.slideTransition.fadeIn);
			imageAnimation.fadeScaleIn(welcomeAnimations.slideTransition.fadeIn);
		}, welcomeAnimations.slideTransition.fadeOut);
	};

	return {
		contentAnimation: contentAnimation.animatedStyle,
		imageAnimation: imageAnimation.animatedStyle,
		textAnimatedStyle,
		dotStyles,
		animateSlideTransition,
	};
};

