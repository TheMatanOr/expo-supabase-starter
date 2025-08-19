import React, { useRef, useMemo, useCallback } from "react";
import { View, TouchableOpacity, Keyboard } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import BottomSheet, {
	BottomSheetView,
	BottomSheetBackdrop,
	BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { H3, Muted } from "@/components/ui/typography";
import { colors } from "@/constants/colors";
import { useColorScheme } from "@/lib/useColorScheme";
import { cn } from "@/lib/utils";
import {
	useBottomSheet,
	BottomSheetItem,
} from "@/context/bottom-sheet-provider";

interface SelectBottomSheetProps {
	// Optional props for future extensibility
	className?: string;
}

export const SelectBottomSheet: React.FC<SelectBottomSheetProps> = () => {
	const { colorScheme } = useColorScheme();
	const bottomSheetRef = useRef<BottomSheet>(null);

	const {
		isVisible,
		title,
		items,
		selectedValues,
		searchable,
		multiple,
		searchQuery,
		onSelect,
		onClose,
		setSearchQuery,
	} = useBottomSheet();

	// Filter items based on search query
	const filteredItems = useMemo(() => {
		if (!searchQuery.trim()) return items;

		return items.filter((item) =>
			item.label.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}, [items, searchQuery]);

	// Always use 70% screen height for consistent experience
	const snapPoints = useMemo(() => ["70%"], []);

	const handleSheetChanges = useCallback(
		(index: number) => {
			if (index === -1) {
				onClose();
			}
		},
		[onClose],
	);

	const renderBackdrop = useCallback(
		(props: any) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
				opacity={0.85}
				pressBehavior="none"
				enableTouchThrough={false}
			/>
		),
		[],
	);

	const handleClose = useCallback(() => {
		Keyboard.dismiss();
		setSearchQuery("");
		// Animate the bottom sheet closed instead of immediately hiding
		bottomSheetRef.current?.close();
	}, [setSearchQuery]);

	const handleItemPress = useCallback(
		(item: BottomSheetItem) => {
			if (item.disabled) return;

			// Call the selection handler
			onSelect(item.value);

			// Note: Removed auto-close for single selections
			// Now both single and multiple selections use the Done button
		},
		[onSelect],
	);

	const isSelected = useCallback(
		(value: string) => {
			return selectedValues.includes(value);
		},
		[selectedValues],
	);

	const renderItem = useCallback(
		(item: BottomSheetItem, index: number) => {
			const selected = isSelected(item.value);

			return (
				<View key={item.value} className="px-4  py-3">
					<TouchableOpacity
						onPress={() => handleItemPress(item)}
						disabled={item.disabled}
						className={cn(
							"flex-row items-center justify-between p-4 rounded-2xl",
							item.disabled && "opacity-50",
						)}
						style={{
							backgroundColor: selected
								? colors[colorScheme || "dark"].card
								: colors[colorScheme || "dark"].card,
							borderWidth: 2, // Keep consistent border width to prevent size jumps
							borderColor: selected
								? colors[colorScheme || "dark"].primary
								: "transparent", // Transparent border for unselected items
							shadowColor: selected
								? colors[colorScheme || "dark"].primary
								: colors[colorScheme || "dark"].foreground,
							shadowOffset: {
								width: 0,
								height: selected ? 4 : 1,
							},
							shadowOpacity: selected ? 0.3 : 0.1,
							shadowRadius: selected ? 8 : 2,
							elevation: selected ? 6 : 2,
						}}
					>
						<View className="flex-1 mr-4">
							<Text
								className={cn(
									"text-base font-medium",
									selected && "text-primary font-semibold",
									item.disabled && "text-muted-foreground",
								)}
								style={{
									color: selected
										? colors[colorScheme || "dark"].primary
										: item.disabled
											? colors[colorScheme || "dark"].mutedForeground
											: colors[colorScheme || "dark"].foreground,
								}}
							>
								{item.label}
							</Text>
							{item.description && (
								<Muted
									className="text-sm mt-1"
									style={{
										color: selected
											? `${colors[colorScheme || "dark"].primary}80`
											: colors[colorScheme || "dark"].mutedForeground,
									}}
								>
									{item.description}
								</Muted>
							)}
						</View>

						{/* Selection indicators */}
						<View className="flex-row items-center">
							{multiple && selected && (
								<View
									className="w-7 h-7 rounded-full items-center justify-center mr-2"
									style={{
										backgroundColor: colors[colorScheme || "dark"].primary,
										shadowColor: colors[colorScheme || "dark"].primary,
										shadowOffset: { width: 0, height: 2 },
										shadowOpacity: 0.4,
										shadowRadius: 4,
										elevation: 4,
									}}
								>
									<AntDesign
										name="check"
										size={16}
										color={colors[colorScheme || "dark"].primaryForeground}
									/>
								</View>
							)}

							{!multiple && selected && (
								<View
									className="w-6 h-6 rounded-full items-center justify-center"
									style={{
										backgroundColor: colors[colorScheme || "dark"].primary,
										shadowColor: colors[colorScheme || "dark"].primary,
										shadowOffset: { width: 0, height: 2 },
										shadowOpacity: 0.4,
										shadowRadius: 4,
										elevation: 4,
									}}
								>
									<AntDesign
										name="check"
										size={14}
										color={colors[colorScheme || "dark"].primaryForeground}
									/>
								</View>
							)}

							{/* Subtle indicator for unselected items */}
							{!selected && (
								<View
									className="w-6 h-6 rounded-full border-2"
									style={{
										borderColor: colors[colorScheme || "dark"].border,
										backgroundColor: "transparent",
									}}
								/>
							)}
						</View>
					</TouchableOpacity>
				</View>
			);
		},
		[handleItemPress, isSelected, multiple, colorScheme],
	);

	if (!isVisible) return null;

	return (
		<BottomSheet
			ref={bottomSheetRef}
			index={0}
			snapPoints={snapPoints}
			onChange={handleSheetChanges}
			backdropComponent={renderBackdrop}
			enablePanDownToClose={false}
			enableOverDrag={false}
			enableDynamicSizing={false}
			keyboardBehavior="extend"
			keyboardBlurBehavior="restore"
			android_keyboardInputMode="adjustResize"
			animateOnMount={true}
			handleIndicatorStyle={{
				backgroundColor: colors[colorScheme || "dark"].border,
				width: 40,
			}}
			backgroundStyle={{
				backgroundColor: colors[colorScheme || "dark"].background,
				borderTopLeftRadius: 24,
				borderTopRightRadius: 24,
				shadowColor: colors[colorScheme || "dark"].foreground,
				shadowOffset: {
					width: 0,
					height: -2,
				},
				shadowOpacity: 0.1,
				shadowRadius: 8,
				elevation: 8,
			}}
		>
			<BottomSheetView className="flex-1">
				{/* Header */}
				<View className="flex-row items-center justify-between px-6 pt-4 pb-2">
					<H3 className="flex-1 text-center">{title}</H3>
					<TouchableOpacity
						onPress={handleClose}
						className="ml-2 p-2"
						hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
					>
						<AntDesign
							name="close"
							size={24}
							color={colors[colorScheme || "dark"].foreground}
						/>
					</TouchableOpacity>
				</View>

				{/* Search Input */}
				{searchable && (
					<View className="px-6 pb-4">
						<Input
							value={searchQuery}
							onChangeText={setSearchQuery}
							placeholder="Search options..."
							variant="search"
							autoCapitalize="none"
							autoCorrect={false}
							clearButtonMode="while-editing"
							iconStart={
								<AntDesign
									name="search1"
									size={20}
									color={colors[colorScheme || "dark"].mutedForeground}
								/>
							}
						/>
					</View>
				)}

				{/* Options List */}
				<BottomSheetScrollView
					className="flex-1 min-h-[400px] max-h-[400px]"
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
					contentContainerStyle={{
						paddingTop: 12,
						//	paddingBottom: multiple && selectedValues.length > 0 ? 20 : 40,
						paddingBottom: 60,
					}}
				>
					{filteredItems.length > 0 ? (
						filteredItems.map((item, index) => renderItem(item, index))
					) : (
						<View className="px-6 py-12 items-center mt-8">
							<Muted className="text-center text-base">
								{searchQuery.trim()
									? "No matching options found"
									: "No options available"}
							</Muted>
						</View>
					)}
				</BottomSheetScrollView>

				{/* Done Button Footer - Always visible */}
				<View
					className="border-t px-6 py-5"
					style={{
						borderTopColor: colors[colorScheme || "dark"].border,
						backgroundColor: colors[colorScheme || "dark"].background,
					}}
				>
					<Button
						variant={selectedValues.length > 0 ? "default" : "muted"}
						size="wide"
						shape="rounded"
						elevate={selectedValues.length > 0}
						disabled={selectedValues.length === 0}
						onPress={handleClose}
						iconEnd={
							selectedValues.length > 0 ? (
								<AntDesign
									name="check"
									size={20}
									color={colors[colorScheme || "dark"].primaryForeground}
								/>
							) : undefined
						}
					>
						{selectedValues.length === 0
							? "Select an option"
							: multiple && selectedValues.length > 1
								? `Done • ${selectedValues.length} selected`
								: "Done"}
					</Button>
				</View>
			</BottomSheetView>
		</BottomSheet>
	);
};
