import { useSharedValue, useAnimatedStyle, withTiming, interpolateColor } from "react-native-reanimated";
import { useEffect } from "react";
import { EASING, ANIMATION_DURATION } from "./useAnimations";

interface UseDotAnimationProps {
	count: number;
	activeIndex: number;
	activeColor: string;
	inactiveColor: string;
	scaleMax?: number;
	scaleMin?: number;
	sizeMin?: number;
	sizeMax?: number;
	duration?: number;
}

export const useDotAnimation = ({
	count,
	activeIndex,
	activeColor,
	inactiveColor,
	scaleMax = 1.2,
	scaleMin = 0.8,
	sizeMin = 8,
	sizeMax = 12,
	duration = ANIMATION_DURATION.normal,
}: UseDotAnimationProps) => {
	// Create shared values for each dot
	const dots = Array.from({ length: count }, (_, index) =>
		useSharedValue(index === activeIndex ? 1 : 0),
	);

	// Initialize dots
	useEffect(() => {
		dots.forEach((dot, index) => {
			dot.value = withTiming(index === activeIndex ? 1 : 0, {
				duration,
				easing: EASING.ease,
			});
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeIndex]);

	// Update dot when activeIndex changes
	const updateDot = (index: number) => {
		dots.forEach((dot, i) => {
			dot.value = withTiming(i === index ? 1 : 0, {
				duration,
				easing: EASING.ease,
			});
		});
	};

	// Create animated styles for each dot
	const dotStyles = dots.map((dot) =>
		useAnimatedStyle(() => {
			const progress = dot.value;
			const scale = progress * (scaleMax - scaleMin) + scaleMin;
			const size = progress * (sizeMax - sizeMin) + sizeMin;

			return {
				backgroundColor: interpolateColor(
					progress,
					[0, 1],
					[inactiveColor, activeColor],
				),
				width: size,
				height: size,
				transform: [{ scale }],
			};
		}),
	);

	return { dots, dotStyles, updateDot };
};

