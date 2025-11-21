import * as React from "react";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import Animated from "react-native-reanimated";

import { useColorScheme } from "@/lib/useColorScheme";
import { Button } from "@/components/ui/button";
import { SafeAreaView } from "@/components/safe-area-view";
import { H1, Muted } from "@/components/ui/typography";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/ui/image";
import { LoginFlow } from "@/components/auth";
import { useWelcomeAnimations } from "./animations";
import { welcomeSlides, welcomeTexts } from "./data";
import type { WelcomeSlide, WelcomeScreenProps } from "./types";

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
	onContinue,
	onLogin,
}) => {
	const router = useRouter();
	const { colors } = useColorScheme();
	const params = useLocalSearchParams();

	// Initialize to last slide if coming from onboarding, otherwise start at 0
	const initialSlide = params.slide === "last" ? welcomeSlides.length - 1 : 0;
	const [currentSlide, setCurrentSlide] = useState<number>(initialSlide);
	const [showLoginSheet, setShowLoginSheet] = useState(false);

	// Animations
	const {
		contentAnimation,
		imageAnimation,
		textAnimatedStyle,
		dotStyles,
		animateSlideTransition: animateTransition,
	} = useWelcomeAnimations(initialSlide, currentSlide);

	// Animate slide transition wrapper
	const animateSlideTransition = (newSlide: number): void => {
		animateTransition(newSlide, setCurrentSlide);
	};

	const handleContinue = (): void => {
		if (currentSlide < welcomeSlides.length - 1) {
			animateSlideTransition(currentSlide + 1);
		} else {
			if (onContinue) {
				onContinue();
			} else {
				router.push("/onboarding");
			}
		}
	};

	const handleLogin = (): void => {
		if (onLogin) {
			onLogin();
		} else {
			setShowLoginSheet(true);
		}
	};

	const handleDotPress = (index: number): void => {
		if (index !== currentSlide) {
			animateSlideTransition(index);
		}
	};

	const currentSlideData: WelcomeSlide = welcomeSlides[currentSlide];

	return (
		<SafeAreaView className="flex flex-1 bg-background p-4 items-center py-6">
			{/* Full animated content area */}
			<Animated.View className="flex w-full flex-1" style={contentAnimation}>
				{/* Animated image section */}
				<View className="flex h-[50%] items-center w-full">
					<Animated.View style={imageAnimation} className="w-full h-full">
						<Image
							source={currentSlideData.image}
							contentFit="contain"
							className="w-full h-full"
						/>
					</Animated.View>
				</View>

				{/* Linear gradient for smooth transition */}
				<LinearGradient
					colors={["rgba(255, 255, 255, 0)", colors.background]}
					style={{
						height: 100,
						width: "100%",
						marginVertical: 10,
						marginTop: -100,
					}}
				/>

				{/* Animated text content */}
				<Animated.View
					className="flex flex-col gap-y-4 mt-6"
					style={textAnimatedStyle}
				>
					<H1 className="text-center">{currentSlideData.title}</H1>
					<Muted className="text-center px-4">
						{currentSlideData.description}
					</Muted>
				</Animated.View>

				{/* Continue/Get Started Button */}
				<View className="w-full gap-y-4 flex-col justify-start mt-10">
					{/* Animated pagination dots */}
					<View className="flex flex-row justify-center items-center mt-10 mb-10">
						{welcomeSlides.map((_, index) => (
							<TouchableOpacity
								key={index}
								onPress={() => handleDotPress(index)}
								className="mx-2"
								activeOpacity={0.7}
							>
								<Animated.View
									className="rounded-full"
									style={dotStyles[index]}
								/>
							</TouchableOpacity>
						))}
					</View>

					<Button
						variant="default"
						className="w-full"
						size="lg"
						onPress={handleContinue}
					>
						<Text>
							{currentSlide === welcomeSlides.length - 1
								? welcomeTexts.buttons.getStarted
								: welcomeTexts.buttons.continue}
						</Text>
					</Button>
					{currentSlide === welcomeSlides.length - 1 && (
						<View className="flex flex-row justify-center items-center">
							<Text className="text-muted-foreground font-light">
								{welcomeTexts.footer.alreadyHaveAccount}
							</Text>
							<Button className="-ml-3" variant="link" onPress={handleLogin}>
								<Text>{welcomeTexts.buttons.login}</Text>
							</Button>
						</View>
					)}
				</View>
			</Animated.View>

			{/* Login Bottom Sheet */}
			<LoginFlow
				isVisible={showLoginSheet}
				onClose={() => setShowLoginSheet(false)}
			/>
		</SafeAreaView>
	);
};
