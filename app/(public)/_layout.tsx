import { Stack } from "expo-router";

import { useColorScheme } from "@/lib/useColorScheme";

export default function PublicLayout() {
	const { colors: themeColors } = useColorScheme();

	return (
		<Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
			<Stack.Screen name="welcome" />

			<Stack.Screen name="onboarding" />

			<Stack.Screen
				name="sign-up"
				options={{
					presentation: "modal",
					headerBackVisible: true,
					headerShown: true,
					headerTitle: "Sign Up",
					headerStyle: {
						backgroundColor: themeColors.background,
					},
					headerTintColor: themeColors.foreground,
					gestureEnabled: true,
					sheetAllowedDetents: [0.5],
					sheetGrabberVisible: true,
				}}
			/>

			<Stack.Screen
				name="sign-in"
				options={{
					presentation: "modal",
					headerShown: true,
					headerTitle: "Sign In",
					headerStyle: {
						backgroundColor: themeColors.background,
					},
					headerTintColor: themeColors.foreground,
					gestureEnabled: true,
				}}
			/>
		</Stack>
	);
}
