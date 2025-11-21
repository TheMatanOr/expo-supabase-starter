import { useSharedValue, withTiming, withDelay } from "react-native-reanimated";
import { useEffect } from "react";
import { Dimensions } from "react-native";
import { EASING } from "@/hooks/useAnimations";

const { width, height } = Dimensions.get("window");

interface ConfettiPiece {
	progress: ReturnType<typeof useSharedValue<number>>;
	opacity: ReturnType<typeof useSharedValue<number>>;
	startX: number;
	endX: number;
	startY: number;
	endY: number;
	rotation: number;
	animDuration: number;
	delay: number;
}

export const useConfettiAnimation = (duration = 3000) => {
	// Create all shared values upfront (50 pieces)
	const createPieces = (): ConfettiPiece[] => {
		return Array.from({ length: 50 }, () => {
			const startX = Math.random() * width;
			const endX = startX + (Math.random() - 0.5) * 100;
			const startY = -50;
			const endY = height + 50;
			const rotation = Math.random() * 360;
			const animDuration = 2000 + Math.random() * 2000;
			const delay = Math.random() * 1000;

			return {
				progress: useSharedValue(0),
				opacity: useSharedValue(1),
				startX,
				endX,
				startY,
				endY,
				rotation,
				animDuration,
				delay,
			};
		});
	};

	// Create pieces - this will be called once per component instance
	const pieces = createPieces();

	useEffect(() => {
		pieces.forEach((piece) => {
			piece.progress.value = withDelay(
				piece.delay,
				withTiming(1, {
					duration: piece.animDuration,
					easing: EASING.ease,
				}),
			);
			piece.opacity.value = withDelay(
				piece.delay,
				withTiming(0, {
					duration: piece.animDuration + 1000,
					easing: EASING.ease,
				}),
			);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return { pieces };
};
