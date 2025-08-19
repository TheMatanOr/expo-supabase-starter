import { router } from "expo-router";
import { View } from "react-native";
import { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { H1, Muted, H3 } from "@/components/ui/typography";
import { SafeAreaView } from "@/components/safe-area-view";
import { SelectInput } from "@/components/ui/select";
import { useColorScheme } from "@/lib/useColorScheme";

export default function Home() {
	const { colors: themeColors } = useColorScheme();
	const [selectedCountry, setSelectedCountry] = useState<string>("");
	const [selectedFruits, setSelectedFruits] = useState<string[]>([]);
	const [selectedWorkoutType, setSelectedWorkoutType] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [emailValue, setEmailValue] = useState("");
	const [inputError, setInputError] = useState("");

	const countryOptions = [
		{ label: "United States", value: "us" },
		{ label: "Canada", value: "ca" },
		{ label: "United Kingdom", value: "uk" },
		{ label: "Germany", value: "de" },
		{ label: "France", value: "fr" },
		{ label: "Japan", value: "jp" },
		{ label: "Australia", value: "au" },
		{ label: "Brazil", value: "br" },
		{ label: "India", value: "in" },
		{ label: "China", value: "cn" },
	];

	const fruitOptions = [
		{ label: "🍎 Apple", value: "apple" },
		{ label: "🍌 Banana", value: "banana" },
		{ label: "🍊 Orange", value: "orange" },
		{ label: "🍇 Grape", value: "grape" },
		{ label: "🍓 Strawberry", value: "strawberry" },
		{ label: "🥭 Mango", value: "mango" },
		{ label: "🍍 Pineapple", value: "pineapple" },
		{ label: "🥝 Kiwi", value: "kiwi" },
	];

	const workoutOptions = [
		{
			label: "Strength Training",
			value: "strength",
			description: "Build muscle and increase strength",
		},
		{
			label: "Cardio",
			value: "cardio",
			description: "Improve cardiovascular health",
		},
		{
			label: "Yoga",
			value: "yoga",
			description: "Flexibility and mindfulness",
		},
		{
			label: "HIIT",
			value: "hiit",
			description: "High-intensity interval training",
		},
		{
			label: "Running",
			value: "running",
			description: "Outdoor or treadmill running",
		},
		{
			label: "Swimming",
			value: "swimming",
			description: "Full body water workout",
			disabled: true,
		},
	];

	return (
		<SafeAreaView className="flex-1 bg-background">
			<View className="flex-1 p-6">
				{/* Header */}
				<View className="items-center mb-8">
					<View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-4">
						<Text className="text-4xl">🎉</Text>
					</View>
					<H1 className="text-center mb-3">Welcome to Beast Mode!</H1>
					<Muted className="text-center text-lg leading-6">
						Test our new select components below
					</Muted>
				</View>

				{/* Select Component Examples */}
				<View className="gap-y-6 mb-8">
					<View>
						<H3 className="mb-3">Single Selection (Searchable)</H3>
						<SelectInput
							title="Select Country"
							placeholder="Choose your country"
							options={countryOptions}
							value={selectedCountry}
							onValueChange={(value) => setSelectedCountry(value as string)}
							searchable={true}
						/>
						{selectedCountry && (
							<Text className="mt-2 text-sm text-muted-foreground">
								Selected:{" "}
								{countryOptions.find((c) => c.value === selectedCountry)?.label}
							</Text>
						)}
					</View>

					<View>
						<H3 className="mb-3">Multiple Selection</H3>
						<SelectInput
							title="Select Fruits"
							placeholder="Choose your favorite fruits"
							options={fruitOptions}
							value={selectedFruits}
							onValueChange={(value) => setSelectedFruits(value as string[])}
							multiple={true}
						/>
						{selectedFruits.length > 0 && (
							<Text className="mt-2 text-sm text-muted-foreground">
								Selected:{" "}
								{selectedFruits
									.map(
										(f) =>
											fruitOptions.find((fruit) => fruit.value === f)?.label,
									)
									.join(", ")}
							</Text>
						)}
					</View>

					<View>
						<H3 className="mb-3">With Descriptions</H3>
						<SelectInput
							title="Select Workout Type"
							placeholder="Choose your workout preference"
							options={workoutOptions}
							value={selectedWorkoutType}
							onValueChange={(value) => setSelectedWorkoutType(value as string)}
							searchable={true}
						/>
						{selectedWorkoutType && (
							<Text className="mt-2 text-sm text-muted-foreground">
								Selected:{" "}
								{
									workoutOptions.find((w) => w.value === selectedWorkoutType)
										?.label
								}
							</Text>
						)}
					</View>
				</View>

				{/* Input Component Examples */}
				<View className="gap-y-6 mb-8">
					<View>
						<H3 className="mb-3">Enhanced Input Components</H3>

						{/* Basic input with icon */}
						<View className="mb-4">
							<Input
								value={inputValue}
								onChangeText={setInputValue}
								placeholder="Enter your name"
								iconStart={
									<AntDesign
										name="user"
										size={20}
										color={themeColors.mutedForeground}
									/>
								}
							/>
						</View>

						{/* Email input with validation */}
						<View className="mb-4">
							<Input
								value={emailValue}
								onChangeText={(text) => {
									setEmailValue(text);
									// Simple email validation
									if (text && !text.includes("@")) {
										setInputError("Please enter a valid email address");
									} else {
										setInputError("");
									}
								}}
								placeholder="Enter your email"
								keyboardType="email-address"
								autoCapitalize="none"
								error={inputError}
								iconStart={
									<AntDesign
										name="mail"
										size={20}
										color={
											inputError
												? themeColors.destructive
												: themeColors.mutedForeground
										}
									/>
								}
								iconEnd={
									emailValue && !inputError ? (
										<AntDesign
											name="checkcircle"
											size={20}
											color={themeColors.primary}
										/>
									) : undefined
								}
							/>
						</View>

						{/* Disabled input */}
						<View className="mb-4">
							<Input
								value="Disabled input"
								placeholder="This input is disabled"
								disabled
								iconStart={
									<AntDesign
										name="lock"
										size={20}
										color={themeColors.mutedForeground}
									/>
								}
							/>
						</View>
					</View>
				</View>

				{/* Quick Actions */}
				<View className="w-full gap-y-4">
					<Button
						variant="default"
						size="wide"
						shape="rounded"
						elevate
						loading={isLoading}
						loadingText="Starting..."
						iconEnd={
							!isLoading ? (
								<AntDesign
									name="arrowright"
									size={20}
									color={themeColors.primaryForeground}
								/>
							) : undefined
						}
						onPress={() => {
							setIsLoading(true);
							setTimeout(() => {
								setIsLoading(false);
								router.push("/(protected)/modal");
							}, 2000);
						}}
					>
						Get Started
					</Button>

					<Button
						variant="outline"
						size="wide"
						shape="rounded"
						iconStart={
							<AntDesign
								name="setting"
								size={20}
								color={themeColors.foreground}
							/>
						}
						onPress={() => router.push("/(protected)/(tabs)/settings")}
					>
						Settings
					</Button>

					{/* Example of different button variants */}
					<View className="flex-row gap-x-3 mt-2">
						<Button variant="secondary" size="sm">
							Secondary
						</Button>
						<Button variant="ghost" size="sm">
							Ghost
						</Button>
						<Button variant="destructive" size="sm" elevate>
							Delete
						</Button>
					</View>
				</View>
			</View>
		</SafeAreaView>
	);
}
