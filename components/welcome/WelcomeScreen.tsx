import * as React from "react";
import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	interpolateColor,
	Easing,
} from "react-native-reanimated";

import { useColorScheme } from "@/lib/useColorScheme";
import { Button } from "@/components/ui/button";
import { SafeAreaView } from "@/components/safe-area-view";
import { H1, Muted } from "@/components/ui/typography";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/ui/image";
import { LoginFlow } from "@/components/auth";
import { welcomeSlides, welcomeTexts, welcomeAnimations } from "./data";
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

	// Animation values
	const fadeAnim = useSharedValue(1);
	const imageFadeAnim = useSharedValue(1);
	const slideProgress = useSharedValue(initialSlide);

	// Create dot animations individually (can't use hooks in map)
	const dot0 = useSharedValue(initialSlide === 0 ? 1 : 0);
	const dot1 = useSharedValue(initialSlide === 1 ? 1 : 0);
	const dot2 = useSharedValue(initialSlide === 2 ? 1 : 0);
	const dotAnimations = [dot0, dot1, dot2];

	// Color values for dot interpolation
	const primaryColorRgba = "rgba(168, 5, 135, 1)";
	const inactiveDotColor = "rgba(156, 163, 175, 0.3)";

	// Initialize dot animations on mount
	useEffect(() => {
		dotAnimations.forEach((anim, index) => {
			anim.value = withTiming(index === initialSlide ? 1 : 0, {
				duration: welcomeAnimations.slideTransition.dotTransition,
				easing: Easing.out(Easing.ease),
			});
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Animated styles for main content
	const contentAnimatedStyle = useAnimatedStyle(() => {
		return {
			opacity: fadeAnim.value,
			transform: [
				{
					scale:
						fadeAnim.value * (1 - welcomeAnimations.scale.min) +
						welcomeAnimations.scale.min,
				},
			],
		};
	});

	// Animated styles for image
	const imageAnimatedStyle = useAnimatedStyle(() => {
		return {
			opacity: imageFadeAnim.value,
			transform: [
				{
					scale:
						imageFadeAnim.value * (1 - welcomeAnimations.scale.min) +
						welcomeAnimations.scale.min,
				},
			],
		};
	});

	// Animated styles for text
	const textAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY:
						(1 - fadeAnim.value) * welcomeAnimations.translateY.offset,
				},
			],
		};
	});

	// Animate slide transition
	const animateSlideTransition = (newSlide: number): void => {
		// Fade out
		fadeAnim.value = withTiming(0, {
			duration: welcomeAnimations.slideTransition.fadeOut,
			easing: Easing.out(Easing.ease),
		});
		imageFadeAnim.value = withTiming(0, {
			duration: welcomeAnimations.slideTransition.fadeOut,
			easing: Easing.out(Easing.ease),
		});

		// Update slide and dots after fade out
		setTimeout(() => {
			setCurrentSlide(newSlide);
			slideProgress.value = newSlide;

			// Animate dots
			dotAnimations.forEach((anim, index) => {
				anim.value = withTiming(index === newSlide ? 1 : 0, {
					duration: welcomeAnimations.slideTransition.dotTransition,
					easing: Easing.out(Easing.ease),
				});
			});

			// Fade in
			fadeAnim.value = withTiming(1, {
				duration: welcomeAnimations.slideTransition.fadeIn,
				easing: Easing.out(Easing.ease),
			});
			imageFadeAnim.value = withTiming(1, {
				duration: welcomeAnimations.slideTransition.fadeIn,
				easing: Easing.out(Easing.ease),
			});
		}, welcomeAnimations.slideTransition.fadeOut);
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

	// Animated dot styles - create all upfront
	const dot0Style = useAnimatedStyle(() => {
		const progress = dot0.value;
		const scale = progress * (welcomeAnimations.scale.max - 0.8) + 0.8;
		const size = progress * 4 + 8; // 8px to 12px

		return {
			backgroundColor: interpolateColor(
				progress,
				[0, 1],
				[inactiveDotColor, primaryColorRgba],
			),
			width: size,
			height: size,
			transform: [{ scale }],
		};
	});

	const dot1Style = useAnimatedStyle(() => {
		const progress = dot1.value;
		const scale = progress * (welcomeAnimations.scale.max - 0.8) + 0.8;
		const size = progress * 4 + 8;

		return {
			backgroundColor: interpolateColor(
				progress,
				[0, 1],
				[inactiveDotColor, primaryColorRgba],
			),
			width: size,
			height: size,
			transform: [{ scale }],
		};
	});

	const dot2Style = useAnimatedStyle(() => {
		const progress = dot2.value;
		const scale = progress * (welcomeAnimations.scale.max - 0.8) + 0.8;
		const size = progress * 4 + 8;

		return {
			backgroundColor: interpolateColor(
				progress,
				[0, 1],
				[inactiveDotColor, primaryColorRgba],
			),
			width: size,
			height: size,
			transform: [{ scale }],
		};
	});

	const dotStyles = [dot0Style, dot1Style, dot2Style];

	return (
		<SafeAreaView className="flex flex-1 bg-background p-4 items-center py-6">
			{/* Full animated content area */}
			<Animated.View
				className="flex w-full flex-1"
				style={contentAnimatedStyle}
			>
				{/* Animated image section */}
				<View className="flex h-[50%] items-center w-full">
					<Animated.View style={imageAnimatedStyle} className="w-full h-full">
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
