import { useSharedValue, useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";

// Animation timing constants
export const ANIMATION_DURATION = {
	fast: 150,
	normal: 200,
	slow: 300,
	verySlow: 500,
} as const;

// Easing presets
export const EASING = {
	ease: Easing.out(Easing.ease),
	cubic: Easing.out(Easing.cubic),
	linear: Easing.linear,
} as const;

// Fade animation hook
export const useFadeAnimation = (initialValue = 1) => {
	const opacity = useSharedValue(initialValue);

	const fadeIn = (duration: number = ANIMATION_DURATION.normal) => {
		opacity.value = withTiming(1, { duration, easing: EASING.ease });
	};

	const fadeOut = (duration: number = ANIMATION_DURATION.normal) => {
		opacity.value = withTiming(0, { duration, easing: EASING.ease });
	};

	const animatedStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
	}));

	return { opacity, fadeIn, fadeOut, animatedStyle };
};

// Slide animation hook
export const useSlideAnimation = (initialValue = 0) => {
	const translateX = useSharedValue(initialValue);
	const translateY = useSharedValue(initialValue);

	const slideTo = (
		x: number,
		y: number,
		duration = ANIMATION_DURATION.normal,
	) => {
		translateX.value = withTiming(x, { duration, easing: EASING.ease });
		translateY.value = withTiming(y, { duration, easing: EASING.ease });
	};

	const slideX = (x: number, duration = ANIMATION_DURATION.normal) => {
		translateX.value = withTiming(x, { duration, easing: EASING.ease });
	};

	const slideY = (y: number, duration = ANIMATION_DURATION.normal) => {
		translateY.value = withTiming(y, { duration, easing: EASING.ease });
	};

	const reset = (duration = ANIMATION_DURATION.normal) => {
		translateX.value = withTiming(0, { duration, easing: EASING.ease });
		translateY.value = withTiming(0, { duration, easing: EASING.ease });
	};

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
	}));

	return {
		translateX,
		translateY,
		slideTo,
		slideX,
		slideY,
		reset,
		animatedStyle,
	};
};

// Scale animation hook
export const useScaleAnimation = (initialValue = 1, min = 0.98, max = 1) => {
	const scale = useSharedValue(initialValue);

	const scaleTo = (value: number, duration: number = ANIMATION_DURATION.normal) => {
		scale.value = withTiming(value, { duration, easing: EASING.ease });
	};

	const scaleIn = (duration: number = ANIMATION_DURATION.normal) => {
		scale.value = withTiming(max, { duration, easing: EASING.ease });
	};

	const scaleOut = (duration: number = ANIMATION_DURATION.normal) => {
		scale.value = withTiming(min, { duration, easing: EASING.ease });
	};

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	return { scale, scaleTo, scaleIn, scaleOut, animatedStyle };
};

// Combined fade + scale animation hook
export const useFadeScaleAnimation = (
	initialOpacity = 1,
	initialScale = 1,
	scaleMin = 0.98,
) => {
	const opacity = useSharedValue(initialOpacity);
	const scale = useSharedValue(initialScale);

	const fadeScaleIn = (duration: number = ANIMATION_DURATION.normal) => {
		opacity.value = withTiming(1, { duration, easing: EASING.ease });
		scale.value = withTiming(1, { duration, easing: EASING.ease });
	};

	const fadeScaleOut = (duration: number = ANIMATION_DURATION.normal) => {
		opacity.value = withTiming(0, { duration, easing: EASING.ease });
		scale.value = withTiming(scaleMin, { duration, easing: EASING.ease });
	};

	const animatedStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
		transform: [
			{
				scale: scale.value * (1 - scaleMin) + scaleMin,
			},
		],
	}));

	return { opacity, scale, fadeScaleIn, fadeScaleOut, animatedStyle };
};

// Combined fade + slide animation hook
export const useFadeSlideAnimation = (
	initialOpacity = 1,
	slideOffset = 50,
) => {
	const opacity = useSharedValue(initialOpacity);
	const translateX = useSharedValue(0);

	const fadeSlideOut = (
		direction: "left" | "right",
		duration = ANIMATION_DURATION.fast,
	) => {
		opacity.value = withTiming(0, { duration, easing: EASING.ease });
		translateX.value = withTiming(
			direction === "left" ? -slideOffset : slideOffset,
			{ duration, easing: EASING.ease },
		);
	};

	const fadeSlideIn = (duration = ANIMATION_DURATION.normal) => {
		opacity.value = withTiming(1, { duration, easing: EASING.ease });
		translateX.value = withTiming(0, { duration, easing: EASING.ease });
	};

	const transition = (
		direction: "next" | "prev",
		onComplete?: () => void,
		fadeOutDuration = ANIMATION_DURATION.fast,
		fadeInDuration = ANIMATION_DURATION.normal,
	) => {
		const slideDir = direction === "next" ? "right" : "left";
		fadeSlideOut(slideDir, fadeOutDuration);

		setTimeout(() => {
			onComplete?.();
			translateX.value = direction === "next" ? slideOffset : -slideOffset;
			fadeSlideIn(fadeInDuration);
		}, fadeOutDuration);
	};

	const animatedStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
		transform: [{ translateX: translateX.value }],
	}));

	return {
		opacity,
		translateX,
		fadeSlideOut,
		fadeSlideIn,
		transition,
		animatedStyle,
	};
};

// Keyboard-aware animation hook
export const useKeyboardAnimation = () => {
	const translateY = useSharedValue(0);

	const animateTo = (value: number, duration = 250) => {
		translateY.value = withTiming(value, {
			duration,
			easing: EASING.ease,
		});
	};

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translateY.value }],
	}));

	return { translateY, animateTo, animatedStyle };
};

