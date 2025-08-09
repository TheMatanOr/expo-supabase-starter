import React from "react";
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
import { handleAuthSuccess, closeAuthSheet } from "../authHelpers";
import type { StepProps } from "../types";

const CELL_COUNT = 5;

export const VerificationStep: React.FC<StepProps> = ({
	data,
	onDataChange,
	onNext,
	onClose,
	mode = "signup",
}) => {
	const ref = useBlurOnFulfill({
		value: data.verificationCode,
		cellCount: CELL_COUNT,
	});

	const [props, getCellOnLayoutHandler] = useClearByFocusCell({
		value: data.verificationCode,
		setValue: (code: string) => onDataChange({ verificationCode: code }),
	});

	const handleVerificationChange = (code: string) => {
		onDataChange({ verificationCode: code });
	};

	const handleContinue = () => {
		if (data.verificationCode.length === CELL_COUNT) {
			// Simulate verification success (replace with actual API call)
			const isVerificationSuccessful = true; // TODO: Replace with actual verification logic

			if (isVerificationSuccessful) {
				// Close the auth sheet and navigate to homepage
				closeAuthSheet(onClose);
				handleAuthSuccess({
					email: data.email,
					method: mode === "signup" ? "email_signup" : "email_login",
				});
			} else {
				// TODO: Show error message
				console.error("Verification failed");
			}
		}
	};

	const handleResendCode = () => {
		// TODO: Implement resend logic
		console.log("Resend code");
	};

	return (
		<View className="flex-1">
			<View className="items-start mb-8">
				<H1 className="text-left mb-3">Check your email</H1>
				<Text className="text-muted-foreground text-left text-lg">
					We sent a verification code to{" "}
					<Text className="text-foreground font-medium">{data.email}</Text>
				</Text>
			</View>

			<View className="mb-10">
				<CodeField
					ref={ref}
					{...props}
					value={data.verificationCode}
					onChangeText={handleVerificationChange}
					cellCount={CELL_COUNT}
					autoFocus={true}
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
								"w-16 h-20 border-2 rounded-lg items-center justify-center mx-0.5",
								isFocused
									? "border-primary bg-primary/5"
									: "border-input bg-background",
							)}
						>
							<Text className="text-lg font-semibold text-foreground">
								{symbol || (isFocused ? <Cursor /> : null)}
							</Text>
						</View>
					)}
				/>
			</View>

			<Button
				onPress={handleContinue}
				disabled={data.verificationCode.length !== CELL_COUNT}
				className="h-14 rounded-full"
				size="lg"
			>
				Continue
			</Button>

			<View className="mt-4">
				<Text className="text-muted-foreground text-sm text-center">
					Didn&apos;t receive the code?{" "}
					<Text className="text-primary font-medium" onPress={handleResendCode}>
						Resend
					</Text>
				</Text>
			</View>
		</View>
	);
};
