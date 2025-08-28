import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/lib/useColorScheme";
import { Image } from "expo-image";
import { useAuth } from "@/hooks/useAuthComplete";

interface CustomHeaderProps {
	avatarUrl?: string;
}

export function CustomHeader({
	avatarUrl = "https://brkphyuqxqdmhueasznn.supabase.co/storage/v1/object/public/avatars/9720042.jpg",
}: CustomHeaderProps) {
	const { colors: themeColors } = useColorScheme();
	const { user } = useAuth();

	const handleSettingsPress = () => {
		router.push("/(protected)/settings");
	};

	// Get user's first name or fallback to "User"
	const displayName = user?.full_name?.split(" ")[0] || "User";

	return (
		<View className="flex-row items-center justify-between px-6 pb-4 my-6">
			{/* Left side - Avatar and Greeting */}
			<View className="flex-row items-center">
				<Image
					source={{ uri: avatarUrl }}
					className="w-16 h-16 rounded-full mr-3"
				/>
			</View>

			{/* Right side - Settings icon */}
			<TouchableOpacity
				onPress={handleSettingsPress}
				className="w-16 h-16 rounded-full items-center justify-center"
			>
				<Ionicons
					name="settings-outline"
					size={24}
					color={themeColors.foreground}
				/>
			</TouchableOpacity>
		</View>
	);
}
