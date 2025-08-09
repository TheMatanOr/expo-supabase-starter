import React, { useState } from "react";
import { View, Text } from "react-native";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { H1 } from "@/components/ui/typography";
import { useAuth } from "@/hooks/useAuth";
import { authTexts } from "../data";
import type { StepProps } from "../types";

export const EmailStep: React.FC<StepProps> = ({
	data,
	onDataChange,
	onNext,
	mode = "signup",
	onSwitchMode,
}) => {
	const {
		sendVerificationCode,
		isSendingCode,
		error,
		fieldErrors,
		clearError,
	} = useAuth();

	// Check if we should show continue anyway option (for signup when user exists)
	const showContinueAnyway =
		mode === "signup" && fieldErrors?.showContinueAnyway;
	const [localEmail, setLocalEmail] = useState(data.email);

	const handleEmailChange = (email: string) => {
		setLocalEmail(email);
		onDataChange({ email });
		clearError();
	};

	const handleContinue = async () => {
		console.log(
			"EmailStep: Starting email verification for:",
			localEmail,
			"mode:",
			mode,
		);

		// If showing continue anyway, switch to login mode for existing user
		const actualMode = showContinueAnyway ? "login" : mode;
		const result = await sendVerificationCode(localEmail, actualMode);

		console.log("EmailStep: Send verification result:", result);
		if (result.success) {
			console.log(
				"EmailStep: Email sent successfully, moving to verification step",
			);
			// Move to verification step
			onNext?.();
		} else {
			console.log("EmailStep: Failed to send email:", result.error);
		}
	};

	// Show email-specific errors (both field errors and general auth errors if email-related)
	const emailError =
		fieldErrors?.email ||
		(error && error.message?.toLowerCase().includes("email")
			? error.message
			: null);
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
					className={`h-14 ${emailError ? "border-red-500" : ""}`}
					editable={!isSendingCode}
				/>
				{emailError && (
					<View>
						<Text className="text-red-500 text-sm mt-2 px-1">{emailError}</Text>
						{showContinueAnyway && (
							<Text className="text-muted-foreground text-xs mt-2 px-1">
								The onboarding data preferences will not be saved. You will just
								be logged into your existing account.
							</Text>
						)}
					</View>
				)}
			</View>

			<Button
				onPress={handleContinue}
				disabled={!localEmail || isSendingCode}
				className="h-14 rounded-full"
				size="lg"
			>
				{isSendingCode
					? "Sending..."
					: showContinueAnyway
						? "Continue anyway"
						: authTexts.email.button}
			</Button>
		</View>
	);
};
