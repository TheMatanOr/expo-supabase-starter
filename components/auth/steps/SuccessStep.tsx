import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/ui/button";
import { H1 } from "@/components/ui/typography";
import { Confetti } from "@/components/ui/confetti";
import type { StepProps } from "../types";

export const SuccessStep: React.FC<StepProps> = ({ data, onNext }) => {
	const [showConfetti, setShowConfetti] = useState(false);

	useEffect(() => {
		// Show confetti when step loads
		setShowConfetti(true);
	}, []);

	const handleGetStarted = () => {
		// Navigate to protected route (home page)
		console.log("User successfully authenticated:", {
			email: data.email,
		});
		router.replace("/(protected)/(tabs)/" as any);
	};

	return (
		<View className="flex-1">
			{showConfetti && <Confetti />}

			<View className="items-start mb-8">
				<View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
					<Text className="text-3xl">✅</Text>
				</View>
				<H1 className="text-left mb-3">Welcome to Beast Mode!</H1>
				<Text className="text-muted-foreground text-left text-lg">
					Your account has been created successfully
				</Text>
			</View>

			<View className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
				<Text className="text-green-800 text-center font-medium">
					🎉 You&apos;re all set! Welcome to the app.
				</Text>
			</View>

			<Button
				onPress={handleGetStarted}
				className="h-14 rounded-full"
				size="lg"
			>
				Get Started
			</Button>
		</View>
	);
};
