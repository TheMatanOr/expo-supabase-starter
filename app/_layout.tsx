import "../global.css";

import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PortalProvider } from "@gorhom/portal";

import { AuthProvider, useAuth } from "@/hooks/useAuthComplete";
import { BottomSheetProvider } from "@/context/bottom-sheet-provider";
import { SelectBottomSheet } from "@/components/ui/select";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
	duration: 400,
	fade: true,
});

export default function RootLayout() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<PortalProvider>
				<AuthProvider>
					<BottomSheetProvider>
						<RootNavigator />
						<SelectBottomSheet />
					</BottomSheetProvider>
				</AuthProvider>
			</PortalProvider>
		</GestureHandlerRootView>
	);
}

function RootNavigator() {
	const { initialized, session } = useAuth();

	if (!initialized) return;
	else {
		SplashScreen.hideAsync();
	}

	return (
		<Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
			<Stack.Protected guard={!!session}>
				<Stack.Screen name="(protected)" />
			</Stack.Protected>

			<Stack.Protected guard={!session}>
				<Stack.Screen name="(public)" />
			</Stack.Protected>
		</Stack>
	);
}
