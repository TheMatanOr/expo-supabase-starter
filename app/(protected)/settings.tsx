import { View, ScrollView } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted, H3 } from "@/components/ui/typography";
import { SafeAreaView } from "@/components/safe-area-view";
import { CustomHeader } from "@/components/ui/custom-header";
import { StreakTracker } from "@/components/ui/streak-tracker";
import { useAuth } from "@/hooks/useAuthComplete";
import { demoStreakData } from "@/lib/demo-data";

export default function Settings() {
	const { signOut } = useAuth();

	return (
		<SafeAreaView className="flex-1 bg-background">
			<Button size="lg" onPress={signOut}>
				Sign Out
			</Button>
		</SafeAreaView>
	);
}
