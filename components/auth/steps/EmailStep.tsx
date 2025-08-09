import React from "react";
import { View, Text } from "react-native";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { H1 } from "@/components/ui/typography";
import type { StepProps } from "../types";

export const EmailStep: React.FC<StepProps> = ({
	data,
	onDataChange,
	onNext,
}) => {
	const handleEmailChange = (email: string) => {
		onDataChange({ email });
	};

	const handleContinue = () => {
		if (data.email) {
			onNext();
		}
	};

	const isValidEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	return (
		<View className="flex-1">
			<View className="items-start mb-8">
				<H1 className="text-left mb-3">Enter your email</H1>
				<Text className="text-muted-foreground text-left text-lg">
					We&apos;ll send you a verification code
				</Text>
			</View>

			<View className="mb-6">
				<Input
					value={data.email}
					onChangeText={handleEmailChange}
					placeholder="Enter your email"
					keyboardType="email-address"
					autoCapitalize="none"
					autoCorrect={false}
					autoComplete="email"
					className="h-14"
				/>
			</View>

			<Button
				onPress={handleContinue}
				disabled={!data.email}
				className="h-14 rounded-full"
				size="lg"
			>
				Continue
			</Button>
		</View>
	);
};
