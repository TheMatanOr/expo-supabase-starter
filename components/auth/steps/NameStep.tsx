import React from "react";
import { View, Text } from "react-native";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { H1 } from "@/components/ui/typography";
import type { StepProps } from "../types";

export const NameStep: React.FC<StepProps> = ({
	data,
	onDataChange,
	onNext,
}) => {
	const handleNameChange = (fullName: string) => {
		onDataChange({ fullName });
	};

	const handleContinue = () => {
		if (data.fullName.trim()) {
			onNext();
		}
	};

	return (
		<View className="flex-1">
			<View className="items-start mb-8">
				<H1 className="text-left mb-3">What&apos;s your name?</H1>
				<Text className="text-muted-foreground text-left text-lg">
					Help us personalize your experience
				</Text>
			</View>

			<View className="mb-6">
				<Input
					value={data.fullName}
					onChangeText={handleNameChange}
					placeholder="Enter your full name"
					autoCapitalize="words"
					autoCorrect={false}
					style={{
						textAlignVertical: "center",
					}}
				/>
			</View>

			<Button
				onPress={handleContinue}
				disabled={!data.fullName.trim()}
				className="h-14 rounded-full"
				size="lg"
			>
				Start
			</Button>
		</View>
	);
};
