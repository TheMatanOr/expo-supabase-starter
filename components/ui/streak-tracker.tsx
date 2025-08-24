import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/lib/useColorScheme";
import { StreakData } from "@/lib/demo-data";
import { H2, H3, H4 } from "./typography";

interface StreakTrackerProps {
	data: StreakData;
}

export function StreakTracker({ data }: StreakTrackerProps) {
	const { colors: themeColors } = useColorScheme();

	const getDayStatusIcon = (completed: boolean) => {
		if (completed) {
			return (
				<View
					className="w-6 h-6 rounded-full items-center justify-center"
					style={{ backgroundColor: themeColors.primary }}
				>
					<Ionicons
						name="checkmark"
						size={16}
						color={themeColors.primaryForeground}
					/>
				</View>
			);
		}

		return (
			<View
				className="w-6 h-6 rounded-full items-center justify-center border-2"
				style={{
					backgroundColor: themeColors.background,
					borderColor: themeColors.border,
				}}
			>
				<Text
					className="text-xs font-bold"
					style={{ color: themeColors.foreground }}
				>
					×
				</Text>
			</View>
		);
	};

	return (
		<View className="p-6 rounded-xl bg-background/50">
			{/* Streak Header */}
			<View className="flex-row items-center justify-between mb-6">
				<H4>Current streak</H4>
				<View className="flex-row items-center">
					<Ionicons name="flame" size={20} color="#FF6B35" />
					<Text className="ml-2 text-base font-semibold text-[#FF6B35]">
						{data.currentStreak} days
					</Text>
				</View>
			</View>

			{/* Weekly Progress */}
			<View className="flex-row justify-between">
				{data.weeklyProgress.map((day, index) => (
					<View key={index} className="items-center">
						{getDayStatusIcon(day.completed)}
						<Text className="text-xs mt-2 font-medium text-muted-foreground">
							{day.day}
						</Text>
					</View>
				))}
			</View>
		</View>
	);
}
