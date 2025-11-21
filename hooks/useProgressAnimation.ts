import { useSharedValue, useAnimatedProps, withTiming } from "react-native-reanimated";
import { useEffect } from "react";
import { EASING, ANIMATION_DURATION } from "./useAnimations";

interface UseProgressAnimationProps {
	progress: number;
	circumference: number;
	duration?: number;
}

export const useProgressAnimation = ({
	progress,
	circumference,
	duration = 1500,
}: UseProgressAnimationProps) => {
	const progressValue = useSharedValue(0);

	useEffect(() => {
		progressValue.value = withTiming(progress, {
			duration,
			easing: EASING.cubic,
		});
	}, [progress, duration]);

	const animatedProps = useAnimatedProps(() => {
		const strokeDashoffset = progressValue.value * circumference;
		return {
			strokeDashoffset: circumference - strokeDashoffset,
		};
	});

	return { progressValue, animatedProps };
};

