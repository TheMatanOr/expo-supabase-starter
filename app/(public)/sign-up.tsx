import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ActivityIndicator, View, Pressable, ScrollView } from "react-native";
import * as z from "zod";
import { useState } from "react";

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { H1, H2 } from "@/components/ui/typography";
import { useAuth } from "@/context/supabase-provider";
import { Confetti } from "@/components/ui/confetti";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const formSchema = z.object({
	email: z.string().email("Please enter a valid email address."),
});

export default function SignUp() {
	const { signUp } = useAuth();
	const [showConfetti, setShowConfetti] = useState(false);
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});

	async function onSubmit(data: z.infer<typeof formSchema>) {
		try {
			// Show confetti animation
			setShowConfetti(true);

			// Show success message after confetti starts
			setTimeout(() => {
				setShowSuccessMessage(true);
			}, 500);

			// Reset form after animation
			setTimeout(() => {
				form.reset();
				setShowConfetti(false);
				setShowSuccessMessage(false);
			}, 4000);
		} catch (error: Error | any) {
			console.error(error.message);
		}
	}

	const handleSocialLogin = (provider: "google" | "apple") => {
		// Show confetti for social login too
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

	return (
		<View className="flex-1 bg-background">
			{showConfetti && (
				<Confetti duration={3000} onComplete={() => setShowConfetti(false)} />
			)}

			{/* Modal/Drawer Container - 40% of screen height */}
			<View className="h-full mt-10">
				{/* Scroll Indicator */}
				<View className="items-center pt-3 pb-2">
					<View className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
				</View>

				{/* Content */}
				<ScrollView
					className="flex-1 px-6"
					showsVerticalScrollIndicator={false}
				>
					{/* Header Section */}
					<View className="items-center mb-8">
						<H1 className="text-center mb-3">Almost there!</H1>
						<Text className="text-muted-foreground text-center text-lg">
							You&apos;re ready to go. Let&apos;s create your account
						</Text>
					</View>

					{/* Success Message */}
					{showSuccessMessage && (
						<View className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
							<Text className="text-green-800 text-center font-medium">
								🎉 You&apos;re ready to go! Let&apos;s create your account
							</Text>
						</View>
					)}

					{/* Continue with Email Button - Prominent */}
					<View className="mb-6">
						<Pressable
							onPress={handleEmailContinue}
							className={cn(
								"flex-row items-center justify-center h-14 rounded-full bg-primary",
								"active:opacity-90",
							)}
						>
							<Text className="text-primary-foreground font-semibold text-lg">
								Continue with Email
							</Text>
						</Pressable>
					</View>

					{/* Social Login Buttons - Side by Side */}
					<View className="flex-row gap-3 mb-6">
						<Pressable
							onPress={() => handleSocialLogin("apple")}
							className={cn(
								"flex-1 items-center justify-center h-12 rounded-full border border-input bg-background",
								"active:bg-accent",
							)}
						>
							<Text className="text-foreground font-medium text-lg">🍎</Text>
						</Pressable>

						<Pressable
							onPress={() => handleSocialLogin("google")}
							className={cn(
								"flex-1 items-center justify-center h-12 rounded-full border border-input bg-background",
								"active:bg-accent",
							)}
						>
							<Text className="text-foreground font-medium text-lg">G</Text>
						</Pressable>
					</View>

					{/* Terms and Privacy */}
					<View className="mb-6">
						<Text className="text-muted-foreground text-sm text-center">
							By continuing, you agree to our{" "}
							<Text className="text-primary font-semibold">Terms of Use</Text>
						</Text>
					</View>
				</ScrollView>
			</View>
		</View>
	);
}
