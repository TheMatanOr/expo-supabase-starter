import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";

interface OptionCardProps {
	id: string;
	label: string;
	description?: string;
	isSelected: boolean;
	onPress: (id: string) => void;
	showCheckmark?: boolean;
	className?: string;
}

export function OptionCard({
	id,
	label,
	description,
	isSelected,
	onPress,
	showCheckmark = true,
	className = "",
}: OptionCardProps) {
	return (
		<TouchableOpacity
			onPress={() => onPress(id)}
			activeOpacity={0.8}
			className={`p-4 rounded-xl border-2 ${
				isSelected
					? "border-primary bg-primary/5"
					: "border-muted bg-background"
			} ${className}`}
		>
			<View className="flex-row items-center justify-between">
				<View className="flex-1">
					<Text
						className={`text-lg font-medium mb-1 ${
							isSelected ? "text-foreground" : "text-foreground"
						}`}
					>
						{label}
					</Text>
					{description && (
						<Text className="text-muted-foreground text-sm">{description}</Text>
					)}
				</View>
				{isSelected && showCheckmark && (
					<View className="w-6 h-6 bg-primary rounded-full items-center justify-center">
						<Text className="text-primary-foreground text-sm font-bold">✓</Text>
					</View>
				)}
			</View>
		</TouchableOpacity>
	);
}
