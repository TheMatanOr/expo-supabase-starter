import React, { useState, useRef, useEffect } from "react";
import { View, Animated, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { Image } from "@/components/image";
import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { useColorScheme } from "@/lib/useColorScheme";
import { colors } from "@/constants/colors";
import { LoginFlow } from "@/components/auth";
import { welcomeSlides, welcomeTexts, welcomeAnimations } from "./data";
import type { WelcomeSlide, WelcomeScreenProps } from "./types";

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
	onContinue,
	onLogin,
}) => {
	const router = useRouter();
	const { colorScheme } = useColorScheme();
	const params = useLocalSearchParams();

	// Initialize to last slide if coming from onboarding, otherwise start at 0
	const initialSlide = params.slide === "last" ? welcomeSlides.length - 1 : 0;
	const [currentSlide, setCurrentSlide] = useState<number>(initialSlide);
	const [showLoginSheet, setShowLoginSheet] = useState(false);
	const fadeAnim = useRef(new Animated.Value(1)).current;
	const imageFadeAnim = useRef(new Animated.Value(1)).current;
	const dotAnimations = useRef(
		welcomeSlides.map(() => new Animated.Value(0)),
	).current;

	// Initialize correct dot as active based on initial slide
	useEffect(() => {
		Animated.timing(dotAnimations[initialSlide], {
			toValue: 1,
			duration: welcomeAnimations.slideTransition.dotTransition,
			useNativeDriver: false,
		}).start();
	}, [initialSlide]);

	const animateSlideTransition = (direction: "next" | "prev"): void => {
		// Fade out current content and image
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 0,
				duration: welcomeAnimations.slideTransition.fadeOut,
				useNativeDriver: true,
			}),
			Animated.timing(imageFadeAnim, {
				toValue: 0,
				duration: welcomeAnimations.slideTransition.fadeOut,
				useNativeDriver: true,
			}),
		]).start(() => {
			// Update slide
			const newSlide =
				direction === "next"
					? Math.min(currentSlide + 1, welcomeSlides.length - 1)
					: Math.max(currentSlide - 1, 0);

			setCurrentSlide(newSlide);

			// Animate dots
			dotAnimations.forEach((anim, index) => {
				Animated.timing(anim, {
					toValue: index === newSlide ? 1 : 0,
					duration: welcomeAnimations.slideTransition.dotTransition,
					useNativeDriver: false,
				}).start();
			});

			// Fade in new content and image
			Animated.parallel([
				Animated.timing(fadeAnim, {
					toValue: 1,
					duration: welcomeAnimations.slideTransition.fadeIn,
					useNativeDriver: true,
				}),
				Animated.timing(imageFadeAnim, {
					toValue: 1,
					duration: welcomeAnimations.slideTransition.fadeIn,
					useNativeDriver: true,
				}),
			]).start();
		});
	};

	const handleContinue = (): void => {
		if (currentSlide < welcomeSlides.length - 1) {
			animateSlideTransition("next");
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
			animateSlideTransition(index > currentSlide ? "next" : "prev");
			setCurrentSlide(index);
		}
	};

	const currentSlideData: WelcomeSlide = welcomeSlides[currentSlide];

	return (
		<SafeAreaView className="flex flex-1 bg-background p-4 items-center py-6">
			{/* Full animated content area */}
			<Animated.View
				className="flex w-full flex-1"
				style={{
					opacity: fadeAnim,
					transform: [
						{
							scale: fadeAnim.interpolate({
								inputRange: [0, 1],
								outputRange: [welcomeAnimations.scale.min, 1],
							}),
						},
					],
				}}
			>
				{/* Animated image section */}
				<View className="flex h-[50%] items-center w-full">
					<Animated.View
						style={{
							opacity: imageFadeAnim,
							transform: [
								{
									scale: imageFadeAnim.interpolate({
										inputRange: [0, 1],
										outputRange: [welcomeAnimations.scale.min, 1],
									}),
								},
							],
						}}
						className="w-full h-full"
					>
						<Image
							source={currentSlideData.image}
							contentFit="contain"
							className="w-full h-full"
						/>
					</Animated.View>
				</View>

				{/* Linear gradient for smooth transition */}
				<LinearGradient
					colors={["transparent", colors[colorScheme || "dark"].background]}
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
					style={{
						transform: [
							{
								translateY: fadeAnim.interpolate({
									inputRange: [0, 1],
									outputRange: [welcomeAnimations.translateY.offset, 0],
								}),
							},
						],
					}}
				>
					<H1 className="text-center">{currentSlideData.title}</H1>
					<Muted className="text-center px-4">
						{currentSlideData.description}
					</Muted>
				</Animated.View>

				{/* Animated Continue/Get Started Button */}
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
									className="w-3 h-3 rounded-full"
									style={{
										backgroundColor: dotAnimations[index].interpolate({
											inputRange: [0, 1],
											outputRange: [
												"rgba(156, 163, 175, 0.3)",
												colors[colorScheme || "dark"].primary,
											],
										}),
										transform: [
											{
												scale: dotAnimations[index].interpolate({
													inputRange: [0, 1],
													outputRange: [0.8, welcomeAnimations.scale.max],
												}),
											},
										],
									}}
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
