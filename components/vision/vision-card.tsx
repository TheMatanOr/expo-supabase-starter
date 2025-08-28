import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { H3 } from "../ui/typography";
import VisionImage from "./vision-image";
import {
	VisionBlockProps,
	VisionImage as VisionImageType,
} from "@/lib/types/vision";

export default function VisionBlock({
	block,
	isEditing = false,
	onUpdate,
	onToggleEdit,
}: VisionBlockProps) {
	const [localTitle, setLocalTitle] = useState(block.title);
	const [localContent, setLocalContent] = useState(block.content);
	const [localImages, setLocalImages] = useState(block.images);

	// Update local state when block changes
	useEffect(() => {
		setLocalTitle(block.title);
		setLocalContent(block.content);
		setLocalImages(block.images);
	}, [block]);

	const handleSave = () => {
		if (onUpdate) {
			onUpdate({
				...block,
				title: localTitle,
				content: localContent,
				images: localImages,
				updatedAt: new Date().toISOString(),
			});
		}
		onToggleEdit?.();
	};

	const handleCancel = () => {
		// Reset local state to original values
		setLocalTitle(block.title);
		setLocalContent(block.content);
		setLocalImages(block.images);
		onToggleEdit?.();
	};

	const handleImageChange = (imageId: string) => (newImageUrl: string) => {
		setLocalImages((prev) =>
			prev.map((img) =>
				img.id === imageId ? { ...img, url: newImageUrl } : img,
			),
		);
	};

	// Separate images by grid type
	const mainImages = localImages.filter((img) => img.gridType === "1");
	const gridImages = localImages.filter((img) => img.gridType === "2");

	return (
		<View className="bg-background/50 rounded-2xl p-6 mb-4">
			<View className="flex-row justify-between items-center mb-4">
				<TextInput
					className="text-lg font-bold flex-1 mr-4"
					value={localTitle}
					onChangeText={setLocalTitle}
					editable={isEditing}
					placeholder="Block title"
				/>
				<View className="flex-row gap-2">
					{isEditing ? (
						<>
							<TouchableOpacity
								onPress={handleCancel}
								className="px-3 py-1 rounded-full bg-gray-200"
							>
								<Text className="text-sm text-gray-700">Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={handleSave}
								className="px-3 py-1 rounded-full bg-green-500"
							>
								<Text className="text-sm text-white">Save</Text>
							</TouchableOpacity>
						</>
					) : (
						<TouchableOpacity
							onPress={onToggleEdit}
							className="px-3 py-1 rounded-full bg-blue-500"
						>
							<Text className="text-sm text-white">Edit</Text>
						</TouchableOpacity>
					)}
				</View>
			</View>

			<TextInput
				className="text-base leading-6 mb-6"
				value={localContent}
				onChangeText={setLocalContent}
				editable={isEditing}
				multiline={true}
				placeholder="Enter your vision content"
				textAlignVertical="top"
			/>

			{/* Main images (grid type 1) */}
			{mainImages.map((image) => (
				<View key={image.id} className="mb-4">
					<VisionImage
						imageUrl={image.url}
						isEditing={isEditing}
						onImageChange={handleImageChange(image.id)}
						className="w-full aspect-square rounded-xl"
						accessibilityLabel={image.alt || `${block.title} main image`}
					/>
				</View>
			))}

			{/* Grid images (grid type 2) */}
			{gridImages.length > 0 && (
				<View className="flex-row gap-x-3">
					{gridImages.map((image) => (
						<VisionImage
							key={image.id}
							imageUrl={image.url}
							isEditing={isEditing}
							onImageChange={handleImageChange(image.id)}
							className="flex-1 h-24 aspect-square rounded-xl"
							accessibilityLabel={image.alt || `${block.title} grid image`}
						/>
					))}
				</View>
			)}
		</View>
	);
}
