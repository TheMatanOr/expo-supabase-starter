import React, { useEffect, useRef } from "react";
import { View, Animated, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

interface ConfettiProps {
	duration?: number;
	onComplete?: () => void;
}

export function Confetti({ duration = 3000, onComplete }: ConfettiProps) {
	const confettiPieces = useRef<Animated.Value[]>([]).current;
	const fadeAnim = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		// Create confetti pieces
		const pieces = Array.from({ length: 50 }, () => new Animated.Value(0));
		confettiPieces.push(...pieces);

		// Animate confetti falling
		const animations = pieces.map((piece, index) => {
			const startX = Math.random() * width;
			const endX = startX + (Math.random() - 0.5) * 100;
			const startY = -50;
			const endY = height + 50;
			const duration = 2000 + Math.random() * 2000;
			const delay = Math.random() * 1000;

			return Animated.sequence([
				Animated.delay(delay),
				Animated.parallel([
					Animated.timing(piece, {
						toValue: 1,
						duration,
						useNativeDriver: true,
					}),
					Animated.timing(fadeAnim, {
						toValue: 0,
						duration: duration + 1000,
						useNativeDriver: true,
					}),
				]),
			]);
		});

		Animated.parallel(animations).start(() => {
			onComplete?.();
		});

		return () => {
			pieces.forEach((piece) => piece.setValue(0));
		};
	}, []);

	const renderConfettiPiece = (index: number) => {
		const piece = confettiPieces[index];
		if (!piece) return null;

		const startX = Math.random() * width;
		const endX = startX + (Math.random() - 0.5) * 100;
		const startY = -50;
		const endY = height + 50;
		const rotation = Math.random() * 360;
		const colors = [
			"#FF6B6B",
			"#4ECDC4",
			"#45B7D1",
			"#96CEB4",
			"#FFEAA7",
			"#DDA0DD",
			"#98D8C8",
		];

		return (
			<Animated.View
				key={index}
				style={{
					position: "absolute",
					left: startX,
					top: piece.interpolate({
						inputRange: [0, 1],
						outputRange: [startY, endY],
					}),
					transform: [
						{
							translateX: piece.interpolate({
								inputRange: [0, 1],
								outputRange: [0, endX - startX],
							}),
						},
						{
							rotate: piece.interpolate({
								inputRange: [0, 1],
								outputRange: ["0deg", `${rotation}deg`],
							}),
						},
					],
					opacity: fadeAnim,
					width: 8,
					height: 8,
					backgroundColor: colors[index % colors.length],
					borderRadius: 4,
				}}
			/>
		);
	};

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
			{Array.from({ length: 50 }, (_, index) => renderConfettiPiece(index))}
		</View>
	);
}
