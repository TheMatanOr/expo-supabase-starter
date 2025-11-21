import { useFadeAnimation } from "@/hooks/useAnimations";
import { authConstants } from "./data";

export const useAuthBottomSheetAnimation = () => {
	const fadeAnimation = useFadeAnimation(1);

	// Animate step transition
	const animateStepTransition = (
		onStepChange: () => void,
	) => {
		fadeAnimation.fadeOut(authConstants.animationDuration);

		setTimeout(() => {
			onStepChange();
			fadeAnimation.fadeIn(authConstants.animationDuration);
		}, authConstants.animationDuration);
	};

	return {
		contentAnimatedStyle: fadeAnimation.animatedStyle,
		animateStepTransition,
	};
};

