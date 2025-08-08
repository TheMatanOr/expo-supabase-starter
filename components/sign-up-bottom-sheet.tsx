import React, { useEffect, useRef, useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { CustomBottomSheet } from "@/components/ui/bottom-sheet";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import { Confetti } from "@/components/ui/confetti";
import { cn } from "@/lib/utils";
import LottieView from "lottie-react-native";
import { Button } from "./ui/button";
import AntDesign from "@expo/vector-icons/AntDesign";
import { colors } from "@/constants/colors";
import Zocial from "@expo/vector-icons/Zocial";
const formSchema = z.object({
	email: z.string().email("Please enter a valid email address."),
});

interface SignUpBottomSheetProps {
	isVisible: boolean;
	onClose: () => void;
}

export function SignUpBottomSheet({
	isVisible,
	onClose,
}: SignUpBottomSheetProps) {
	const [showConfetti, setShowConfetti] = useState(false);
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});

	const handleSocialLogin = (provider: "google" | "apple") => {
		// Show confetti for social login
		setShowConfetti(true);
		setTimeout(() => {
			setShowConfetti(false);
		}, 3000);

		console.log(`${provider} login pressed`);
	};

	const handleEmailContinue = () => {
		// Show confetti for email continue
		setShowConfetti(true);
		setTimeout(() => {
			setShowConfetti(false);
		}, 3000);

		console.log("Continue with email pressed");
	};

	const animation = useRef<LottieView>(null);
	useEffect(() => {
		// Play animation up to 50% (frame 30 out of 60)
		if (isVisible && animation.current) {
			// animation.current.play(0, 30); // Play from frame 0 to frame 30 (50%)
		}
	}, [isVisible]);

	return (
		<CustomBottomSheet isVisible={isVisible} onClose={onClose}>
			<View className="flex-1 px-6 pb-10">
				{/* Header Section */}
				<View className="items-center mb-8 -mt-4">
					<LottieView
						autoPlay={true}
						loop={false}
						ref={animation}
						style={{
							width: 120,
							height: 120,
						}}
						// Find more Lottie files at https://lottiefiles.com/featured
						source={require("@/assets/animations/star.json")}
					/>

					<H1 className="text-center mb-3 -mt-4">Almost there!</H1>
					<Text className="text-muted-foreground text-center text-lg">
						You&apos;re ready to go. Let&apos;s create your account
					</Text>
				</View>

				{/* Continue with Email Button - Prominent */}
				<View className="mb-6">
					<Button
						iconStart={
							<Zocial name="email" size={24} color={colors.dark.foreground} />
						}
						size="lg"
					>
						Continue with Email
					</Button>
				</View>

				{/* Social Login Buttons - Side by Side */}
				<View className="flex-row gap-3 mb-6">
					<Button variant="outline" size="lg" className="flex-1">
						<AntDesign name="google" size={24} color={colors.dark.foreground} />
					</Button>
					<Button variant="outline" size="lg" className="flex-1">
						<AntDesign name="apple1" size={24} color={colors.dark.foreground} />
					</Button>
				</View>

				{/* Terms and Privacy */}
				<View className="mb-6">
					<Text className="text-muted-foreground text-sm text-center">
						By continuing, you agree to our{" "}
						<Text className="text-primary font-semibold">Terms of Use</Text>
					</Text>
				</View>
			</View>
		</CustomBottomSheet>
	);
}
