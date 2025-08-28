import { View } from "react-native";
import { SemiCircularProgress } from "./index";
import { H3, P } from "./typography";
import { useAuth } from "@/hooks/useAuthComplete";
import { Button } from "./button";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

export default function HomeVisualizeCard() {
	const { user } = useAuth();
	const router = useRouter();
	return (
		<View className=" flex-1 w-full px-6 mt-10">
			<View className="bg-background w-full  rounded-2xl p-6 ">
				<View className="flex-row justify-center  items-center">
					<View className=" justify-center items-center gap-y-6 mb-8 ">
						<SemiCircularProgress
							totalAccount={10}
							currentCount={7}
							size={150}
							fontScale={1.1}
							strokeWidth={16}
						/>
						<H3 className="">Today&apos;s Count</H3>
					</View>
				</View>

				{/* <P>{user?.vision}</P> */}

				<Button
					onPress={() => router.push("/(protected)/vision")}
					size="lg"
					className="mt-auto m"
				>
					Start
				</Button>
			</View>
		</View>
	);
}
