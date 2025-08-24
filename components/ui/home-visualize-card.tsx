import { View } from "react-native";
import { SemiCircularProgress } from "./index";
import { H3, P } from "./typography";
import { useAuth } from "@/context/supabase-provider";

export default function HomeVisualizeCard() {
	const { user } = useAuth();
	return (
		<View className=" flex-1 w-full px-6 mt-10">
			<View className="bg-background w-full h-full rounded-2xl p-6 ">
				<H3>How I Am?</H3>
				<P>{user?.vision}</P>
			</View>
		</View>
	);
}
