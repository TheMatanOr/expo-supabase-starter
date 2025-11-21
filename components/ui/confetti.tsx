import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useConfettiAnimation } from "./confetti/animations";

interface ConfettiProps {
	duration?: number;
	onComplete?: () => void;
}

interface ConfettiPieceProps {
	progress: Animated.SharedValue<number>;
	opacity: Animated.SharedValue<number>;
	startX: number;
	endX: number;
	startY: number;
	endY: number;
	rotation: number;
	color: string;
}

const ConfettiPiece: React.FC<ConfettiPieceProps> = ({
	progress,
	opacity,
	startX,
	endX,
	startY,
	endY,
	rotation,
	color,
}) => {
	const animatedStyle = useAnimatedStyle(() => {
		return {
			position: "absolute" as const,
			left: startX,
			top: progress.value * (endY - startY) + startY,
			transform: [
				{
					translateX: progress.value * (endX - startX),
				},
				{
					rotate: `${progress.value * rotation}deg`,
				},
			],
			opacity: opacity.value,
		};
	});

	return (
		<Animated.View
			style={[
				animatedStyle,
				{
					width: 8,
					height: 8,
					backgroundColor: color,
					borderRadius: 4,
				},
			]}
		/>
	);
};

export function Confetti({ duration = 3000, onComplete }: ConfettiProps) {
	// Animations
	const { pieces } = useConfettiAnimation(duration);

	useEffect(() => {
		const timeout = setTimeout(() => {
			onComplete?.();
		}, duration);

		return () => clearTimeout(timeout);
	}, [duration, onComplete]);

	const confettiColors = [
		"#FF6B6B",
		"#4ECDC4",
		"#45B7D1",
		"#96CEB4",
		"#FFEAA7",
		"#DDA0DD",
		"#98D8C8",
	];

	return (
		<View
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				pointerEvents: "none",
			}}
		>
			{pieces.map((piece, index) => (
				<ConfettiPiece
					key={index}
					progress={piece.progress}
					opacity={piece.opacity}
					startX={piece.startX}
					endX={piece.endX}
					startY={piece.startY}
					endY={piece.endY}
					rotation={piece.rotation}
					color={confettiColors[index % confettiColors.length]}
				/>
			))}
		</View>
	);
}
