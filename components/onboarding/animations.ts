import { useAnimatedStyle } from "react-native-reanimated";
import { useFadeSlideAnimation } from "@/hooks/useAnimations";
import { useKeyboardAnimation } from "@/hooks/useAnimations";
import { onboardingAnimations } from "./data";

export const useOnboardingAnimations = (
	keyboardHeight: number,
	isKeyboardVisible: boolean,
) => {
	// Content fade and slide animation
	const contentAnimation = useFadeSlideAnimation(1, onboardingAnimations.stepTransition.slideOffset);

	// Keyboard-aware button animation
	const keyboardAnimation = useKeyboardAnimation();

	// Button animated style
	const buttonAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: keyboardHeight > 0
						? -keyboardAnimation.translateY.value + 20
						: 0,
				},
			],
		};
	});

	// Animate step transition
	const animateStepTransition = (
		direction: "next" | "prev",
		onStepChange: () => void,
	) => {
		contentAnimation.transition(
			direction,
			onStepChange,
			onboardingAnimations.stepTransition.fadeOut,
			onboardingAnimations.stepTransition.fadeIn,
		);
	};

	// Handle keyboard show/hide
	const handleKeyboardShow = (height: number) => {
		keyboardAnimation.animateTo(height);
	};

	const handleKeyboardHide = () => {
		keyboardAnimation.animateTo(0);
	};

	return {
		contentAnimatedStyle: contentAnimation.animatedStyle,
		buttonAnimatedStyle,
		animateStepTransition,
		handleKeyboardShow,
		handleKeyboardHide,
	};
};

