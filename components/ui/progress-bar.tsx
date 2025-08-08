import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";

interface ProgressBarProps {
	currentStep: number;
	totalSteps: number;
	showPercentage?: boolean;
	showStepCounter?: boolean;
	className?: string;
}

export function ProgressBar({
	currentStep,
	totalSteps,
	showPercentage = true,
	showStepCounter = true,
	className = "",
}: ProgressBarProps) {
	const progressPercentage = (currentStep / totalSteps) * 100;

	return (
		<View className={`px-4 pt-4 ${className}`}>
			{(showStepCounter || showPercentage) && (
				<View className="flex-row items-center justify-between mb-2">
					{showStepCounter && (
						<Text className="text-sm text-muted-foreground">
							Step {currentStep} of {totalSteps}
						</Text>
					)}
					{showPercentage && (
						<Text className="text-sm text-muted-foreground">
							{Math.round(progressPercentage)}%
						</Text>
					)}
				</View>
			)}
			<View className="h-2 bg-muted rounded-full overflow-hidden">
				<View
					className="h-full bg-primary rounded-full"
					style={{
						width: `${progressPercentage}%`,
					}}
				/>
			</View>
		</View>
	);
}
