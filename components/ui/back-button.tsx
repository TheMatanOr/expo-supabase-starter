import React from "react";
import { TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";

interface BackButtonProps {
	onPress: () => void;
	text?: string;
	className?: string;
}

export function BackButton({
	onPress,
	text = "← Back",
	className = "",
}: BackButtonProps) {
	return (
		<TouchableOpacity
			onPress={onPress}
			className={`self-start ${className}`}
			activeOpacity={0.7}
		>
			<Text className="text-primary text-base">{text}</Text>
		</TouchableOpacity>
	);
}
