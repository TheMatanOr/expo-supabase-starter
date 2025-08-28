import { router } from "expo-router";
import { View, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { H1, Muted, H3, H2 } from "@/components/ui/typography";
import { SafeAreaView } from "@/components/safe-area-view";
import { CustomHeader } from "@/components/ui/custom-header";
import { StreakTracker } from "@/components/ui/streak-tracker";
import { demoStreakData } from "@/lib/demo-data";
import { useAuth } from "@/hooks/useAuthComplete";
import HomeVisualizeCard from "@/components/ui/home-visualize-card";
import { SemiCircularProgress } from "@/components/ui";
import GardientBackground from "@/components/ui/gardient-background";

export default function Home() {
	const { user } = useAuth();
	return (
		<GardientBackground>
			{/* Custom Header */}
			<CustomHeader />

			{/* Scrollable Content */}
			<View className="px-6">
				{/* Streak Tracker */}
				<View className="mb-6">
					<StreakTracker data={demoStreakData} />

					<View className="mt-10">
						<H1 className="font-light text-4xl text-center mb-3">
							Hey {user?.full_name}.
						</H1>
						<H1 className="font-semibold text-5xl text-center">
							Time to Visualize
						</H1>
					</View>
				</View>
			</View>
			<HomeVisualizeCard />
		</GardientBackground>
	);
}
