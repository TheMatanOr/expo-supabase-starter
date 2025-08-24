import { colors } from "@/constants/colors";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated, Easing, TouchableOpacity } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";

interface SemiCircularProgressProps {
	totalAccount: number;
	currentCount: number;
	size?: number;
	strokeWidth?: number;
	showPercentage?: boolean;
}

export default function SemiCircularProgress({
	totalAccount,
	currentCount: initialCurrentCount,
	size = 200,
	strokeWidth = 20,
	showPercentage = true,
}: SemiCircularProgressProps) {
	const [currentCount, setCurrentCount] = useState(initialCurrentCount);
	const progressAnimation = useRef(new Animated.Value(0)).current;
	const textAnimation = useRef(new Animated.Value(0)).current;

	const radius = (size - strokeWidth) / 2;
	const circumference = Math.PI * radius;
	const progress =
		totalAccount > 0 ? Math.min(currentCount / totalAccount, 1) : 0;
	const strokeDasharray = circumference;

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

	const handleIncrement = () => {
		const newCount = Math.min(currentCount + 1, totalAccount);
		setCurrentCount(newCount);
	};

	const handleDecrement = () => {
		const newCount = Math.max(currentCount - 1, 0);
		setCurrentCount(newCount);
	};

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

				{/* Center text */}
				<View className="absolute inset-0 top-10 items-center justify-center ">
					<Text className="text-4xl font-bold text-gray-800">
						{currentCount}
					</Text>
					{showPercentage && (
						<Text className="text-sm text-gray-600 mt-1">
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
