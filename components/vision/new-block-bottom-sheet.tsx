import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CustomBottomSheet, CustomBottomSheetRef } from "@/components/ui/bottom-sheet";
import { Text } from "@/components/ui/text";

interface NewBlockBottomSheetProps {
	visible: boolean;
	onClose: () => void;
	onSave: (title: string, content: string) => void;
}

export default function NewBlockBottomSheet({
	visible,
	onClose,
	onSave,
}: NewBlockBottomSheetProps) {
	const [title, setTitle] = useState("New Vision Block");
	const [content, setContent] = useState("Describe your vision here...");
	const titleInputRef = useRef<TextInput>(null);
	const bottomSheetRef = useRef<CustomBottomSheetRef>(null);

	// Auto-focus when bottom sheet opens
	useEffect(() => {
		if (visible) {
			setTimeout(() => {
				titleInputRef.current?.focus();
			}, 500);
		} else {
			// Reset values when bottom sheet closes
			setTitle("New Vision Block");
			setContent("Describe your vision here...");
		}
	}, [visible]);

	const handleSave = () => {
		if (title.trim() && content.trim()) {
			onSave(title.trim(), content.trim());
			onClose();
		}
	};

	return (
		<CustomBottomSheet
			ref={bottomSheetRef}
			isVisible={visible}
			onClose={onClose}
			snapPoints={["60%"]}
		>
			<View className="flex-1 px-6 pb-6">
				{/* Header */}
				<View className="flex-row justify-between items-center mb-6 pt-2">
					<Text className="text-2xl font-bold text-white">
						New Vision Block
					</Text>
					<TouchableOpacity
						onPress={onClose}
						className="bg-white/10 rounded-full p-2"
					>
						<Ionicons name="close" size={20} color="white" />
					</TouchableOpacity>
				</View>

				{/* Title Input */}
				<View className="mb-4">
					<Text className="text-white/80 mb-2 font-medium">Title</Text>
					<TextInput
						ref={titleInputRef}
						value={title}
						onChangeText={setTitle}
						className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-white text-lg border border-white/20"
						placeholder="Enter block title"
						placeholderTextColor="rgba(255,255,255,0.5)"
						selectTextOnFocus
						autoFocus
					/>
				</View>

				{/* Content Input */}
				<View className="mb-6 flex-1">
					<Text className="text-white/80 mb-2 font-medium">Content</Text>
					<TextInput
						value={content}
						onChangeText={setContent}
						className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-white text-lg border border-white/20 flex-1"
						placeholder="Describe your vision..."
						placeholderTextColor="rgba(255,255,255,0.5)"
						multiline
						textAlignVertical="top"
						selectTextOnFocus
					/>
				</View>

				{/* Action Buttons */}
				<View className="flex-row gap-3">
					<TouchableOpacity
						onPress={onClose}
						className="flex-1 bg-white/10 rounded-2xl py-4"
					>
						<Text className="text-center font-semibold text-white">
							Cancel
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={handleSave}
						className="flex-1 bg-white rounded-2xl py-4 flex-row justify-center items-center gap-2"
					>
						<Ionicons name="save" size={16} color="#000" />
						<Text className="text-center font-semibold text-black">
							Save
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</CustomBottomSheet>
	);
}
