import { View, Text } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "@/components/safe-area-view";

export default function GardientBackground({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<LinearGradient
			colors={["#F5E9FF", "#E6F4FF", "#FDEBFB"]} // very light lavender → sky → pink
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
			style={{ flex: 1 }}
		>
			<SafeAreaView className="flex-1">{children}</SafeAreaView>
		</LinearGradient>
	);
}
