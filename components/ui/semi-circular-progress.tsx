import { colors } from "@/constants/colors";
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { useSemiCircularProgressAnimation } from "./semi-circular-progress/animations";

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

	const radius = (size - strokeWidth) / 2;
	const circumference = Math.PI * radius;
	const progress =
		totalAccount > 0 ? Math.min(currentCount / totalAccount, 1) : 0;
	const strokeDasharray = circumference;

	// Animations
	const { animatedProps } = useSemiCircularProgressAnimation(
		progress,
		circumference,
	);

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
						animatedProps={animatedProps}
						d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
						stroke={colors.primary}
						strokeWidth={strokeWidth}
						fill="transparent"
						strokeLinecap="round"
						strokeDasharray={strokeDasharray}
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
