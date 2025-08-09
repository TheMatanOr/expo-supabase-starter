import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import {
	CodeField,
	Cursor,
	useBlurOnFulfill,
	useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { Button } from "@/components/ui/button";
import { H1 } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { authTexts } from "../data";
import type { StepProps } from "../types";

const CELL_COUNT = 6;

export const VerificationStep: React.FC<StepProps> = ({
	data,
	onDataChange,
	onNext,
	onBack,
	onClose,
	onboardingData,
}) => {
	const {
		verifyCode,
		sendVerificationCode,
		isVerifying,
		isSendingCode,
		error,
		fieldErrors,
		clearError,
		completeAuth,
	} = useAuth();
	const [localCode, setLocalCode] = useState(data.verificationCode);
	const [countdown, setCountdown] = useState(0);
	const [canResend, setCanResend] = useState(true);

	const ref = useBlurOnFulfill({
		value: localCode,
		cellCount: CELL_COUNT,
	});

	const [props, getCellOnLayoutHandler] = useClearByFocusCell({
		value: localCode,
		setValue: (code: string) => {
			setLocalCode(code);
			onDataChange({ verificationCode: code });
			clearError();
		},
	});

	const handleVerificationChange = (code: string) => {
		setLocalCode(code);
		onDataChange({ verificationCode: code });
		clearError();
	};

	const handleContinue = async () => {
		if (localCode.length === CELL_COUNT) {
			const result = await verifyCode(
				data.email,
				localCode,
				data.fullName,
				onboardingData,
			);

			if (result.success) {
				// Close auth sheet and complete authentication
				if (onClose) onClose();
				await completeAuth();
			}
		}
	};

	// Start countdown when component mounts (email just sent)
	useEffect(() => {
		setCountdown(60);
		setCanResend(false);
	}, []);

	// Countdown timer effect
	useEffect(() => {
		if (countdown > 0) {
			setCanResend(false); // Ensure button is disabled during countdown
			const timer = setTimeout(() => {
				setCountdown(countdown - 1);
			}, 1000);
			return () => clearTimeout(timer);
		} else if (countdown === 0) {
			setCanResend(true); // Enable button when countdown reaches 0
		}
	}, [countdown]);

	const handleResendCode = async () => {
		if (!canResend || isSendingCode) return;

		const result = await sendVerificationCode(data.email);

		if (result.success) {
			// Reset countdown after successful resend
			setCountdown(60);
			setCanResend(false);
		}
	};

	const getResendText = () => {
		if (isSendingCode) {
			return "Sending...";
		} else if (countdown > 0) {
			return `Resend (${countdown}s)`;
		} else {
			return authTexts.verification.resend.link; // Just "Resend" when countdown is 0
		}
	};

	// Only show verification-specific errors on this step (not email errors)
	const codeError = fieldErrors?.verificationCode;

	return (
		<View className="flex-1">
			<View className="items-start mb-8">
				<H1 className="text-left mb-3">{authTexts.verification.title}</H1>
				<Text className="text-muted-foreground text-left text-lg">
					{authTexts.verification.subtitle}{" "}
					<Text className="text-foreground font-medium">{data.email}</Text>
				</Text>
			</View>

			<View className="mb-10">
				<CodeField
					ref={ref}
					{...props}
					value={localCode}
					onChangeText={handleVerificationChange}
					cellCount={CELL_COUNT}
					autoFocus={true}
					editable={!isVerifying}
					rootStyle={{
						marginTop: 0,
						width: "100%",
						marginLeft: "auto",
						marginRight: "auto",
					}}
					keyboardType="number-pad"
					textContentType="oneTimeCode"
					renderCell={({ index, symbol, isFocused }) => (
						<View
							key={index}
							onLayout={getCellOnLayoutHandler(index)}
							className={cn(
								"w-12 h-16 border-2 rounded-lg items-center justify-center mx-0.5",
								isFocused
									? "border-primary bg-primary/5"
									: codeError
										? "border-red-500 bg-red-50"
										: "border-input bg-background",
							)}
						>
							<Text className="text-base font-semibold text-foreground">
								{symbol || (isFocused ? <Cursor /> : null)}
							</Text>
						</View>
					)}
				/>
				{codeError && (
					<Text className="text-red-500 text-sm mt-4 text-center">
						{codeError}
					</Text>
				)}
			</View>

			<Button
				onPress={handleContinue}
				disabled={localCode.length !== CELL_COUNT || isVerifying}
				className="h-14 rounded-full"
				size="lg"
			>
				{isVerifying ? "Verifying..." : authTexts.verification.button}
			</Button>

			<View className="mt-4">
				<Text className="text-muted-foreground text-sm text-center">
					{authTexts.verification.resend.text}{" "}
					<Text
						className={`font-medium ${
							canResend && !isSendingCode
								? "text-primary cursor-pointer"
								: "text-muted-foreground opacity-60"
						}`}
						onPress={canResend && !isSendingCode ? handleResendCode : undefined}
					>
						{getResendText()}
					</Text>
				</Text>
			</View>
		</View>
	);
};
