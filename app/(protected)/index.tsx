import { router } from "expo-router";
import { View, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted, H3, H2 } from "@/components/ui/typography";
import { SafeAreaView } from "@/components/safe-area-view";
import { SelectInput } from "@/components/ui/select";
import { CustomHeader } from "@/components/ui/custom-header";
import { StreakTracker } from "@/components/ui/streak-tracker";
import { useColorScheme } from "@/lib/useColorScheme";
import { demoStreakData } from "@/lib/demo-data";
import { useAuth } from "@/context/supabase-provider";
import HomeVisualizeCard from "@/components/ui/home-visualize-card";
import { SemiCircularProgress } from "@/components/ui";

export default function Home() {
	const { user, signOut } = useAuth();
	return (
		<LinearGradient
			colors={["#F5E9FF", "#E6F4FF", "#FDEBFB"]} // very light lavender → sky → pink
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
			style={{ flex: 1 }}
		>
			<SafeAreaView className="flex-1">
				{/* Custom Header */}
				<CustomHeader />

				{/* Scrollable Content */}
				<View className="px-6">
					{/* Streak Tracker */}
					<View className="mb-6">
						<StreakTracker data={demoStreakData} />

						<View className="mt-10">
							<H1 className="font-semibold text-5xl text-center mb-3">
								Hey {user?.full_name}.
							</H1>
							<H1 className="font-semibold text-5xl text-center">
								Time to Visualize
							</H1>
						</View>
					</View>
					<SemiCircularProgress
						totalAccount={10}
						currentCount={7}
						size={180}
						strokeWidth={16}
					/>
				</View>
				<HomeVisualizeCard />
			</SafeAreaView>
		</LinearGradient>
	);
}
