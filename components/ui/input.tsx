import * as React from "react";
import { TextInput, View, Text, type TextInputProps } from "react-native";
import { cn } from "@/lib/utils";
import { useColorScheme } from "@/lib/useColorScheme";
import { colors } from "@/constants/colors";

interface InputProps extends TextInputProps {
	iconStart?: React.ReactNode;
	iconEnd?: React.ReactNode;
	error?: string;
	disabled?: boolean;
	variant?: "default" | "search";
	containerClassName?: string;
}

const Input = React.forwardRef<
	React.ComponentRef<typeof TextInput>,
	InputProps
>(
	(
		{
			className,
			placeholderClassName,
			iconStart,
			iconEnd,
			error,
			disabled,
			variant = "default",
			containerClassName,
			...props
		},
		ref,
	) => {
		const { colorScheme } = useColorScheme();
		const hasError = !!error;
		const isDisabled = disabled || props.editable === false;

		// Get proper colors based on state
		const getBorderColor = () => {
			if (hasError) return colors[colorScheme || "dark"].destructive;
			return colors[colorScheme || "dark"].border;
		};

		const getBackgroundColor = () => {
			return colors[colorScheme || "dark"].input;
		};

		const getTextColor = () => {
			if (isDisabled) return colors[colorScheme || "dark"].mutedForeground;
			return colors[colorScheme || "dark"].foreground;
		};

		const getPlaceholderColor = () => {
			return colors[colorScheme || "dark"].mutedForeground;
		};

		if (iconStart || iconEnd || hasError) {
			// Enhanced input with icons or error state
			return (
				<View className={cn("relative", containerClassName)}>
					<View
						className="relative flex-row items-center"
						style={{
							backgroundColor: getBackgroundColor(),
							borderColor: getBorderColor(),
							borderWidth: 1,
							borderRadius: variant === "search" ? 24 : 28, // More rounded for search
							height: 64,
							paddingHorizontal: iconStart || iconEnd ? 16 : 24,
							opacity: isDisabled ? 0.6 : 1,
						}}
					>
						{iconStart && (
							<View className="mr-3" style={{ opacity: isDisabled ? 0.5 : 1 }}>
								{iconStart}
							</View>
						)}

						<TextInput
							ref={ref}
							className={cn(
								"flex-1 text-base native:text-lg native:leading-[1.25] web:outline-none",
								className,
							)}
							style={{
								color: getTextColor(),
								textAlignVertical: "center",
							}}
							placeholderTextColor={getPlaceholderColor()}
							editable={!isDisabled}
							{...props}
						/>

						{iconEnd && (
							<View className="ml-3" style={{ opacity: isDisabled ? 0.5 : 1 }}>
								{iconEnd}
							</View>
						)}
					</View>

					{hasError && (
						<View className="mt-2 px-1">
							<Text
								className="text-sm"
								style={{ color: colors[colorScheme || "dark"].destructive }}
							>
								{error}
							</Text>
						</View>
					)}
				</View>
			);
		}

		// Basic input fallback
		return (
			<TextInput
				ref={ref}
				className={cn(
					"web:flex h-10 native:h-16 web:w-full rounded-full border border-input bg-input px-6 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
					isDisabled && "opacity-50 web:cursor-not-allowed",
					className,
				)}
				style={{
					backgroundColor: getBackgroundColor(),
					borderColor: getBorderColor(),
					color: getTextColor(),
				}}
				placeholderTextColor={getPlaceholderColor()}
				editable={!isDisabled}
				{...props}
			/>
		);
	},
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
