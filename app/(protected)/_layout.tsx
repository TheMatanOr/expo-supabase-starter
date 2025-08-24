import { Stack } from "expo-router";

export default function ProtectedLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name="index" />
			<Stack.Screen
				name="settings"
				options={{
					presentation: "modal",
					headerShown: true,
					title: "Settings",
					headerBackTitle: "Back",
				}}
			/>
			<Stack.Screen name="modal" options={{ presentation: "modal" }} />
		</Stack>
	);
}
