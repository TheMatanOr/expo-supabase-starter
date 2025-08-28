import React, { useState } from "react";
import { View, Text } from "react-native";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { H1 } from "@/components/ui/typography";
import { authTexts } from "../data";
import type { StepProps } from "../types";
import { useAuth } from "@/hooks/useAuthComplete";
import { router } from "expo-router";

export const EmailStep: React.FC<StepProps> = ({
	data,
	onDataChange,
	onNext,
	mode = "signup",
	onboardingData,
	onSwitchMode,
}) => {
	const { signInOTP, isLoading } = useAuth();
	const [error, setError] = useState<string | null>(null);
	const [userAlreadyExists, setUserAlreadyExists] = useState(false);
	const [localEmail, setLocalEmail] = useState(data.email);

	const handleEmailChange = (email: string) => {
		setLocalEmail(email);
		onDataChange({ email });
		setError(null);
	};

	const handleSignInOTP = async () => {
		const result = await signInOTP(localEmail, onboardingData);
		console.log("EmailStep: Sign in OTP result:", result);
		if (result.success) {
			onNext?.();
		} else {
			setError(result.error?.message || "Failed to send verification code");
		}
		if (result.error?.code === "USER_EXISTS") {
			setUserAlreadyExists(true);
		}
	};

	const texts = authTexts.email[mode];

	return (
		<View className="flex-1">
			<View className="items-start mb-8">
				<H1 className="text-left mb-3">{texts.title}</H1>
				<Text className="text-muted-foreground text-left text-lg">
					{texts.subtitle}
				</Text>
			</View>

			<View className="mb-6">
				<Input
					value={localEmail}
					onChangeText={handleEmailChange}
					placeholder={authTexts.email.placeholder}
					keyboardType="email-address"
					autoCapitalize="none"
					autoCorrect={false}
					autoComplete="email"
					className={`h-14 ${error ? "border-red-500" : ""}`}
					editable={!isLoading}
				/>
				{error && (
					<View>
						<Text className="text-red-500 text-sm mt-2 px-1">{error}</Text>
						{userAlreadyExists && (
							<View className="flex flex-row justify-center items-center">
								<Text className="text-muted-foreground font-light">
									Looks like a user with this email is alredy exists
								</Text>
							</View>
						)}
					</View>
				)}
			</View>

			<Button
				onPress={handleSignInOTP}
				disabled={!localEmail || isLoading}
				className="h-14 rounded-full"
				size="lg"
			>
				{isLoading ? "Sending..." : authTexts.email.button}
			</Button>
		</View>
	);
};
