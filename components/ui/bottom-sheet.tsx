import React, { useCallback, useMemo, useRef } from "react";
import { View, Text } from "react-native";
import { BlurView } from "expo-blur";
import BottomSheet, {
	BottomSheetView,
	BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { colors } from "@/constants/colors";

interface BottomSheetProps {
	isVisible: boolean;
	onClose: () => void;
	children: React.ReactNode;
	snapPoints?: string[];
	index?: number;
}

export function CustomBottomSheet({
	isVisible,
	onClose,
	children,
	snapPoints,
	index = 0,
}: BottomSheetProps) {
	const bottomSheetRef = useRef<BottomSheet>(null);

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
				pressBehavior="close"
				enableTouchThrough={false}
			></BottomSheetBackdrop>
		),
		[],
	);

	if (!isVisible) return null;

	return (
		<BottomSheet
			ref={bottomSheetRef}
			index={index}
			snapPoints={snapPoints}
			onChange={handleSheetChanges}
			backdropComponent={renderBackdrop}
			enablePanDownToClose={true}
			animateOnMount={true}
			backgroundStyle={{
				backgroundColor: colors.dark.background,
				borderTopLeftRadius: 50,
				borderTopRightRadius: 50,
				borderTopColor: colors.dark.primary,
				borderTopWidth: 0,
				shadowColor: "#9d009896",
				shadowOffset: {
					width: 0,
					height: 20,
				},
				shadowOpacity: 1.0,
				shadowRadius: 40.0,
				elevation: 60,
			}}
			handleIndicatorStyle={{
				backgroundColor: colors.dark.muted,
				width: 40,
				height: 4,
			}}
		>
			<BottomSheetView className="flex-1">{children}</BottomSheetView>
		</BottomSheet>
	);
}
