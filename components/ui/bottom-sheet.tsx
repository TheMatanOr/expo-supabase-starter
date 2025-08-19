import React, {
	useCallback,
	useMemo,
	useRef,
	forwardRef,
	useImperativeHandle,
} from "react";
import { View, Text } from "react-native";
import { BlurView } from "expo-blur";
import BottomSheet, {
	BottomSheetView,
	BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { useColorScheme } from "@/lib/useColorScheme";

interface BottomSheetProps {
	isVisible: boolean;
	onClose: () => void;
	children: React.ReactNode;
	snapPoints?: string[];
	index?: number;
}

export interface CustomBottomSheetRef {
	close: (animationConfigs?: any) => void;
}

export const CustomBottomSheet = forwardRef<
	CustomBottomSheetRef,
	BottomSheetProps
>(({ isVisible, onClose, children, snapPoints, index = 0 }, ref) => {
	const { colors } = useColorScheme();
	const bottomSheetRef = useRef<BottomSheet>(null);

	useImperativeHandle(ref, () => ({
		close: (animationConfigs?: any) => {
			bottomSheetRef.current?.close(animationConfigs);
		},
	}));

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
			></BottomSheetBackdrop>
		),
		[],
	);

	if (!isVisible) return null;

	return (
		<BottomSheet
			ref={bottomSheetRef}
			index={index}
			snapPoints={snapPoints || ["55%"]}
			onChange={handleSheetChanges}
			backdropComponent={renderBackdrop}
			enablePanDownToClose={false}
			enableOverDrag={false}
			enableDynamicSizing={false}
			animateOnMount={true}
			handleComponent={null}
			backgroundStyle={{
				backgroundColor: colors.background,
				borderTopLeftRadius: 50,
				borderTopRightRadius: 50,
				borderTopColor: colors.primary,
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
		>
			<BottomSheetView className="flex-1">{children}</BottomSheetView>
		</BottomSheet>
	);
});

CustomBottomSheet.displayName = "CustomBottomSheet";
