import React, { useState, useRef } from "react";
import { View, TextInput, Animated, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

interface MaterialInputProps {
	label: string;
	value: string;
	onChangeText: (text: string) => void;
	placeholder?: string;
	error?: string;
	secureTextEntry?: boolean;
	autoCapitalize?: "none" | "sentences" | "words" | "characters";
	autoComplete?: string;
	autoCorrect?: boolean;
	keyboardType?:
		| "default"
		| "email-address"
		| "numeric"
		| "phone-pad"
		| "number-pad";
	maxLength?: number;
	className?: string;
}

export function MaterialInput({
	label,
	value,
	onChangeText,
	placeholder,
	error,
	secureTextEntry = false,
	autoCapitalize = "none",
	autoComplete,
	autoCorrect = false,
	keyboardType = "default",
	maxLength,
	className,
}: MaterialInputProps) {
	const [isFocused, setIsFocused] = useState(false);
	const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;
	const inputRef = useRef<TextInput>(null);

	const handleFocus = () => {
		setIsFocused(true);
		Animated.timing(animatedValue, {
			toValue: 1,
			duration: 200,
			useNativeDriver: false,
		}).start();
	};

	const handleBlur = () => {
		setIsFocused(false);
		if (!value) {
			Animated.timing(animatedValue, {
				toValue: 0,
				duration: 200,
				useNativeDriver: false,
			}).start();
		}
	};

	const handleChangeText = (text: string) => {
		onChangeText(text);
		if (text && !isFocused) {
			Animated.timing(animatedValue, {
				toValue: 1,
				duration: 200,
				useNativeDriver: false,
			}).start();
		}
	};

	const labelStyle = {
		transform: [
			{
				translateY: animatedValue.interpolate({
					inputRange: [0, 1],
					outputRange: [0, -25],
				}),
			},
			{
				scale: animatedValue.interpolate({
					inputRange: [0, 1],
					outputRange: [1, 0.85],
				}),
			},
		],
		color: animatedValue.interpolate({
			inputRange: [0, 1],
			outputRange: ["#6B7280", isFocused ? "#3B82F6" : "#374151"],
		}),
	};

	return (
		<View className={cn("mb-4", className)}>
			<Pressable
				onPress={() => inputRef.current?.focus()}
				className={cn(
					"relative h-14 border rounded-lg bg-background px-3 justify-center",
					isFocused
						? "border-primary border-2"
						: error
							? "border-destructive"
							: "border-input",
				)}
			>
				<Animated.View
					style={labelStyle}
					className="absolute left-3 pointer-events-none"
				>
					<Text className="text-sm font-medium">{label}</Text>
				</Animated.View>

				<TextInput
					ref={inputRef}
					value={value}
					onChangeText={handleChangeText}
					onFocus={handleFocus}
					onBlur={handleBlur}
					placeholder={isFocused ? placeholder : ""}
					placeholderTextColor="#9CA3AF"
					secureTextEntry={secureTextEntry}
					autoCapitalize={autoCapitalize}
					autoComplete={autoComplete}
					autoCorrect={autoCorrect}
					keyboardType={keyboardType}
					maxLength={maxLength}
					className="flex-1 pt-4 text-foreground text-base"
					style={{ color: "#1F2937" }}
				/>
			</Pressable>

			{error && (
				<Text className="text-destructive text-sm mt-1 ml-1">{error}</Text>
			)}
		</View>
	);
}
