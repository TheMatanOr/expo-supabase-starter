import React, { useState } from "react";
import { View, TextInput, Pressable } from "react-native";
import Animated from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { useMaterialInputAnimation } from "./material-input/animations";

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
	const inputRef = React.useRef<TextInput>(null);

	// Animations
	const {
		handleFocus: animateFocus,
		handleBlur: animateBlur,
		handleChangeText: animateChangeText,
		labelAnimatedStyle,
	} = useMaterialInputAnimation(value, isFocused);

	const handleFocus = () => {
		setIsFocused(true);
		animateFocus();
	};

	const handleBlur = () => {
		setIsFocused(false);
		animateBlur();
	};

	const handleChangeText = (text: string) => {
		animateChangeText(text);
		onChangeText(text);
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
					style={labelAnimatedStyle}
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
					autoComplete={autoComplete as any}
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
