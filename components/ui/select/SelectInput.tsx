import React, { useMemo, useCallback } from "react";
import { View, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Text } from "@/components/ui/text";
import { Muted } from "@/components/ui/typography";
import { colors } from "@/constants/colors";
import { useColorScheme } from "@/lib/useColorScheme";
import { cn } from "@/lib/utils";
import { useBottomSheet } from "@/context/bottom-sheet-provider";
import type { SelectInputProps } from "./types";

export const SelectInput: React.FC<SelectInputProps> = ({
	placeholder = "Select an option",
	options,
	value,
	onValueChange,
	multiple = false,
	searchable = false,
	title,
	disabled = false,
	searchPlaceholder = "Search options...",
	className,
	showSelectedCount = true,
	noOptionsText = "No options available",
	filterFunction,
}) => {
	const { colorScheme } = useColorScheme();
	const { showBottomSheet } = useBottomSheet();

	// Convert value to array for consistent handling
	const selectedValues = useMemo(() => {
		if (!value) return [];
		return Array.isArray(value) ? value : [value];
	}, [value]);

	// Get display text for the input
	const displayText = useMemo(() => {
		if (selectedValues.length === 0) {
			return placeholder;
		}

		if (!multiple) {
			const selectedOption = options.find(
				(opt) => opt.value === selectedValues[0],
			);
			return selectedOption?.label || placeholder;
		}

		// Multiple selection display
		if (selectedValues.length === 1) {
			const selectedOption = options.find(
				(opt) => opt.value === selectedValues[0],
			);
			return selectedOption?.label || placeholder;
		}

		if (showSelectedCount) {
			return `${selectedValues.length} items selected`;
		}

		// Show first few items, then "and X more"
		const firstTwo = selectedValues
			.slice(0, 2)
			.map((val) => options.find((opt) => opt.value === val)?.label)
			.filter(Boolean);

		if (selectedValues.length > 2) {
			return `${firstTwo.join(", ")} and ${selectedValues.length - 2} more`;
		}

		return firstTwo.join(", ");
	}, [selectedValues, options, multiple, placeholder, showSelectedCount]);

	const isPlaceholderText = selectedValues.length === 0;

	// Handle selection change
	const handleSelectionChange = useCallback(
		(selectedValue: string) => {
			if (disabled) return;

			if (!multiple) {
				onValueChange(selectedValue);
				return;
			}

			// Multiple selection logic
			const currentValues = [...selectedValues];
			const valueIndex = currentValues.indexOf(selectedValue);

			if (valueIndex >= 0) {
				// Remove if already selected
				currentValues.splice(valueIndex, 1);
			} else {
				// Add if not selected
				currentValues.push(selectedValue);
			}

			onValueChange(currentValues);
		},
		[disabled, multiple, selectedValues, onValueChange],
	);

	const handlePress = useCallback(() => {
		if (disabled || options.length === 0) return;

		// Convert options to BottomSheetItem format
		const bottomSheetItems = options.map((option) => ({
			label: option.label,
			value: option.value,
			disabled: option.disabled,
			description: option.description,
		}));

		showBottomSheet({
			title,
			items: bottomSheetItems,
			selectedValues,
			searchable,
			multiple,
			onSelect: handleSelectionChange,
			onClose: () => {}, // Context handles this
		});
	}, [
		disabled,
		options,
		title,
		selectedValues,
		searchable,
		multiple,
		handleSelectionChange,
		showBottomSheet,
	]);

	return (
		<TouchableOpacity
			onPress={handlePress}
			disabled={disabled}
			className={cn(
				"flex-row items-center justify-between h-16 rounded-full border border-input bg-input px-6",
				disabled && "opacity-50",
				className,
			)}
			style={{
				backgroundColor: colors[colorScheme || "dark"].input,
				borderColor: colors[colorScheme || "dark"].border,
			}}
		>
			<View className="flex-1 mr-3">
				<Text
					className={cn(
						"text-base",
						isPlaceholderText && "text-muted-foreground",
					)}
					style={{
						color: isPlaceholderText
							? colors[colorScheme || "dark"].mutedForeground
							: colors[colorScheme || "dark"].foreground,
					}}
					numberOfLines={1}
				>
					{displayText}
				</Text>
			</View>

			<View className="flex-row items-center">
				{/* Selected count badge for multiple selection */}
				{multiple && selectedValues.length > 0 && !showSelectedCount && (
					<View className="bg-primary rounded-full w-6 h-6 items-center justify-center mr-2">
						<Text
							className="text-primary-foreground text-xs font-bold"
							style={{
								color: colors[colorScheme || "dark"].primaryForeground,
							}}
						>
							{selectedValues.length}
						</Text>
					</View>
				)}

				<AntDesign
					name="down"
					size={16}
					color={
						disabled
							? colors[colorScheme || "dark"].mutedForeground
							: colors[colorScheme || "dark"].foreground
					}
				/>
			</View>
		</TouchableOpacity>
	);
};
