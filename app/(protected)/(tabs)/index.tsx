import { router } from "expo-router";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { SafeAreaView } from "@/components/safe-area-view";

export default function Home() {
	return (
		<SafeAreaView className="flex-1 bg-background">
			<View className="flex-1 items-center justify-center p-6 gap-y-6">
				{/* Welcome Section */}
				<View className="items-center mb-8">
					<View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-4">
						<Text className="text-4xl">🎉</Text>
					</View>
					<H1 className="text-center mb-3">Welcome to Beast Mode!</H1>
					<Muted className="text-center text-lg leading-6">
						You&apos;re all set up and ready to start your fitness journey. Your
						session is secure and will persist across app restarts.
					</Muted>
				</View>

				{/* Quick Actions */}
				<View className="w-full max-w-sm gap-y-4">
					<Button
						className="w-full h-14"
						variant="default"
						size="lg"
						onPress={() => router.push("/(protected)/modal")}
					>
						<Text className="font-semibold">Get Started</Text>
					</Button>

					<Button
						className="w-full h-14"
						variant="outline"
						size="lg"
						onPress={() => router.push("/(protected)/(tabs)/settings")}
					>
						<Text>Settings</Text>
					</Button>
				</View>

				{/* Status */}
				<View className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
					<Text className="text-green-800 text-center font-medium">
						✅ Successfully authenticated and logged in
					</Text>
				</View>
			</View>
		</SafeAreaView>
	);
}
