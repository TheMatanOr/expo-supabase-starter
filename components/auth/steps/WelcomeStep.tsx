import React, { useRef, useEffect } from "react";
import { View, Text } from "react-native";
import LottieView from "lottie-react-native";
import { Button } from "@/components/ui/button";
import { H1 } from "@/components/ui/typography";
import { colors } from "@/constants/colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import Zocial from "@expo/vector-icons/Zocial";
import { handleAuthSuccess, closeAuthSheet } from "../authHelpers";
import type { StepProps } from "../types";

export const WelcomeStep: React.FC<StepProps> = ({
	onNext,
	onClose,
	mode = "signup",
}) => {
	const animation = useRef<LottieView>(null);

	useEffect(() => {
		if (animation.current) {
			animation.current.play(0, 0.5);
		}
	}, []);

	const handleEmailContinue = () => {
		onNext?.();
	};

	const handleSocialLogin = (provider: "google" | "apple") => {
		console.log(`${provider} login pressed`);

		// TODO: Implement actual Google/Apple authentication
		// For now, simulate successful auth
		const simulateSuccess = false; // Set to true to test direct navigation

		if (simulateSuccess) {
			closeAuthSheet(onClose);
			handleAuthSuccess({
				email: `user@${provider}.com`, // Placeholder email
				method: `${provider}_${mode}`,
			});
		} else {
			// TODO: Implement actual OAuth flow
			console.log(`TODO: Implement ${provider} OAuth`);
		}
	};

	return (
		<View className="flex-1">
			<View className="items-center mb-8">
				<LottieView
					autoPlay={true}
					loop={false}
					ref={animation}
					style={{
						marginTop: -30,
						width: 120,
						height: 120,
					}}
					source={require("@/assets/animations/star.json")}
				/>

				<H1 className="text-center mb-3 -mt-4">
					{mode === "signup" ? "Almost there!" : "Welcome back"}
				</H1>
				<Text className="text-muted-foreground text-center text-lg">
					{mode === "signup"
						? "You&apos;re ready to go. Let&apos;s create your account"
						: "Sign in to continue to your account"}
				</Text>
			</View>

			<View className="mb-6">
				<Button
					onPress={handleEmailContinue}
					iconStart={
						<Zocial name="email" size={24} color={colors.dark.foreground} />
					}
					size="lg"
				>
					Continue with Email
				</Button>
			</View>

			<View className="flex-row gap-3 mb-6">
				<Button
					variant="outline"
					size="lg"
					className="flex-1"
					onPress={() => handleSocialLogin("google")}
				>
					<AntDesign name="google" size={24} color={colors.dark.foreground} />
				</Button>
				<Button
					variant="outline"
					size="lg"
					className="flex-1"
					onPress={() => handleSocialLogin("apple")}
				>
					<AntDesign name="apple1" size={24} color={colors.dark.foreground} />
				</Button>
			</View>

			<View className="mb-6">
				<Text className="text-muted-foreground text-sm text-center">
					By continuing, you agree to our{" "}
					<Text className="text-primary font-semibold">Terms of Use</Text>
				</Text>
			</View>
		</View>
	);
};
