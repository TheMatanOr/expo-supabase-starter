import { colors } from "@/constants/colors";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated, Easing } from "react-native";
import Svg, { Path } from "react-native-svg";

interface SemiCircularProgressProps {
	totalAccount: number;
	currentCount: number;
	size?: number; // diameter of the full circle
	strokeWidth?: number;
	showPercentage?: boolean;
	fontScale?: number; // optional: scale the text size (1 = default)
}

export default function SemiCircularProgress({
	totalAccount,
	currentCount: initialCurrentCount,
	size = 200,
	strokeWidth = 20,
	showPercentage = true,
	fontScale = 1,
}: SemiCircularProgressProps) {
	const [currentCount, setCurrentCount] = useState(initialCurrentCount);
	const progressAnimation = useRef(new Animated.Value(0)).current;
	const textAnimation = useRef(new Animated.Value(0)).current;

	const radius = (size - strokeWidth) / 2;
	const circumference = Math.PI * radius;
	const progress =
		totalAccount > 0 ? Math.min(currentCount / totalAccount, 1) : 0;
	const strokeDasharray = circumference;

	// Dynamically calculate text sizes based on size and fontScale
	const mainTextSize = Math.round((size / 6) * fontScale); // e.g. 40 for size=200, scale=1
	const subTextSize = Math.round((size / 12) * fontScale); // e.g. 16 for size=200, scale=1

	// Dynamically calculate vertical offset for centering text
	const verticalOffset = size / 6; // empirically looks good

	useEffect(() => {
		// Animate the progress
		Animated.timing(progressAnimation, {
			toValue: progress,
			duration: 1500,
			easing: Easing.out(Easing.cubic),
			useNativeDriver: false,
		}).start();

		// Animate the text
		Animated.timing(textAnimation, {
			toValue: currentCount,
			duration: 1500,
			easing: Easing.out(Easing.cubic),
			useNativeDriver: false,
		}).start();
	}, [currentCount, totalAccount, progress, progressAnimation, textAnimation]);

	const animatedStrokeDashoffset = progressAnimation.interpolate({
		inputRange: [0, 1],
		outputRange: [circumference, 0],
	});

	return (
		<View className="items-center justify-center">
			<View style={{ width: size, height: size / 2 }}>
				<Svg width={size} height={size / 2} viewBox={`0 0 ${size} ${size / 2}`}>
					{/* Background circle (unfilled) */}
					<Path
						d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
						stroke={colors.muted}
						strokeWidth={strokeWidth}
						fill="transparent"
						strokeLinecap="round"
					/>

					{/* Progress circle (filled) */}
					<AnimatedPath
						d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
						stroke={colors.primary}
						strokeWidth={strokeWidth}
						fill="transparent"
						strokeLinecap="round"
						strokeDasharray={strokeDasharray}
						strokeDashoffset={animatedStrokeDashoffset}
						strokeLinejoin="round"
					/>
				</Svg>

				{/* Center text, vertically offset to look centered in the semi-circle */}
				<View
					pointerEvents="none"
					style={{
						position: "absolute",
						left: 0,
						right: 0,
						top: verticalOffset,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Text
						style={{
							fontSize: mainTextSize,
							fontWeight: "bold",
							color: "#1f2937", // text-gray-800
						}}
					>
						{currentCount}
					</Text>
					{showPercentage && (
						<Text
							style={{
								fontSize: subTextSize,
								color: "#6b7280", // text-gray-600
								marginTop: subTextSize * 0.2,
							}}
						>
							of {totalAccount}
						</Text>
					)}
				</View>
			</View>
		</View>
	);
}

// Animated version of Path for smooth progress animation
const AnimatedPath = Animated.createAnimatedComponent(Path);
