import { useSharedValue, useAnimatedStyle, withTiming, interpolateColor } from "react-native-reanimated";
import { useEffect } from "react";
import { EASING, ANIMATION_DURATION } from "@/hooks/useAnimations";

export const useMaterialInputAnimation = (
	value: string,
	isFocused: boolean,
) => {
	const animatedValue = useSharedValue(value ? 1 : 0);

	// Update animated value when value changes externally
	useEffect(() => {
		if (value) {
			animatedValue.value = withTiming(1, {
				duration: ANIMATION_DURATION.normal,
				easing: EASING.ease,
			});
		}
	}, [value]);

	// Animate on focus
	const handleFocus = () => {
		animatedValue.value = withTiming(1, {
			duration: ANIMATION_DURATION.normal,
			easing: EASING.ease,
		});
	};

	// Animate on blur
	const handleBlur = () => {
		if (!value) {
			animatedValue.value = withTiming(0, {
				duration: ANIMATION_DURATION.normal,
				easing: EASING.ease,
			});
		}
	};

	// Animate on text change
	const handleChangeText = (text: string) => {
		if (text && !isFocused) {
			animatedValue.value = withTiming(1, {
				duration: ANIMATION_DURATION.normal,
				easing: EASING.ease,
			});
		}
	};

	// Animated label style
	const labelAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: animatedValue.value * -25,
				},
				{
					scale: animatedValue.value * (0.85 - 1) + 1,
				},
			],
			color: interpolateColor(
				animatedValue.value,
				[0, 1],
				["#6B7280", isFocused ? "#3B82F6" : "#374151"],
			),
		};
	});

	return {
		handleFocus,
		handleBlur,
		handleChangeText,
		labelAnimatedStyle,
	};
};

