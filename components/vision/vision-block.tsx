import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import VisionImage from "./vision-image";
import {
	VisionBlockProps,
	VisionImage as VisionImageType,
	GridType,
} from "@/lib/types/vision";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";

export default function VisionBlock({
	block,
	isEditing = false,
	onUpdate,
	onDelete,
	autoFocus = false,
}: VisionBlockProps) {
	const [localTitle, setLocalTitle] = useState(block.title);
	const [localContent, setLocalContent] = useState(block.content);
	const [localImages, setLocalImages] = useState(block.images);
	const wasEditingRef = useRef(isEditing);

	// Update local state when block changes
	useEffect(() => {
		setLocalTitle(block.title);
		setLocalContent(block.content);
		setLocalImages(block.images);
	}, [block]);

	// Call updateParent when exiting edit mode
	useEffect(() => {
		if (wasEditingRef.current && !isEditing && onUpdate) {
			// Only update if something actually changed
			const hasChanged =
				localTitle !== block.title ||
				localContent !== block.content ||
				JSON.stringify(localImages) !== JSON.stringify(block.images);

			if (hasChanged) {
				onUpdate({
					...block,
					title: localTitle,
					content: localContent,
					images: localImages,
					updatedAt: new Date().toISOString(),
				});
			}
		}
		wasEditingRef.current = isEditing;
	}, [isEditing]);

	const handleImageChange = (imageId: string) => (newImageUrl: string) => {
		setLocalImages((prev) =>
			prev.map((img) =>
				img.id === imageId ? { ...img, url: newImageUrl } : img,
			),
		);
	};

	// Handle adding new image with grid type selection
	const handleAddImage = () => {
		Alert.alert("Add Image", "Choose image layout:", [
			{
				text: "Full Width",
				onPress: () => addNewImage("1"),
			},
			{
				text: "Grid (Side by Side)",
				onPress: () => addNewImage("2"),
			},
			{
				text: "Cancel",
				style: "cancel",
			},
		]);
	};

	const addNewImage = (gridType: GridType) => {
		if (gridType === "1") {
			// Add single full-width image
			const newImage: VisionImageType = {
				id: `image-${Date.now()}`,
				url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
				gridType,
				alt: `${block.title} image`,
			};
			setLocalImages((prev) => [...prev, newImage]);
		} else {
			// Add pair of grid images (always add 2 for grid layout)
			const timestamp = Date.now();
			const newImages: VisionImageType[] = [
				{
					id: `image-${timestamp}-1`,
					url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
					gridType: "2",
					alt: `${block.title} grid image 1`,
				},
				{
					id: `image-${timestamp}-2`,
					url: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
					gridType: "2",
					alt: `${block.title} grid image 2`,
				},
			];
			setLocalImages((prev) => [...prev, ...newImages]);
		}
	};

	// Handle deleting an image
	const handleDeleteImage = (imageId: string, imageGridType: GridType) => {
		Alert.alert("Delete Image", "Are you sure you want to delete this image?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Delete",
				style: "destructive",
				onPress: () => {
					// For both main and grid images, replace with placeholder instead of removing
					setLocalImages((prev) =>
						prev.map((img) =>
							img.id === imageId
								? {
										...img,
										url: "",
										alt: `${block.title} placeholder`,
									}
								: img,
						),
					);
				},
			},
		]);
	};

	// Separate images by grid type and group grid images in pairs
	const mainImages = localImages.filter((img) => img.gridType === "1");
	const gridImages = localImages.filter((img) => img.gridType === "2");

	// Group grid images in pairs for display
	const gridImagePairs: VisionImageType[][] = [];
	for (let i = 0; i < gridImages.length; i += 2) {
		const pair = gridImages.slice(i, i + 2);
		gridImagePairs.push(pair);
	}

	return (
		<View className="bg-background/50 rounded-2xl p-6 mb-4">
			<View className="flex-row justify-between items-center mb-4">
				<TextInput
					className="text-lg font-bold flex-1 mr-4"
					value={localTitle}
					onChangeText={setLocalTitle}
					editable={isEditing}
					placeholder="Block title"
					autoFocus={autoFocus && isEditing}
					selectTextOnFocus={autoFocus}
				/>
				{isEditing && (
					<TouchableOpacity
						onPress={onDelete}
						className="bg-red-500 rounded-full p-2"
					>
						<Ionicons name="trash" size={16} color="white" />
					</TouchableOpacity>
				)}
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
				<View key={image.id} className="mb-4 relative">
					<VisionImage
						imageUrl={image.url}
						isEditing={isEditing}
						onImageChange={handleImageChange(image.id)}
						className="w-full aspect-square rounded-xl"
						accessibilityLabel={image.alt || `${block.title} main image`}
					/>
					{isEditing && (
						<TouchableOpacity
							onPress={() => handleDeleteImage(image.id, image.gridType)}
							className="absolute top-2 right-2 bg-red-500 rounded-full p-1"
						>
							<Ionicons name="close" size={12} color="white" />
						</TouchableOpacity>
					)}
				</View>
			))}

			{/* Grid images (grid type 2) - displayed in pairs */}
			{gridImagePairs.map((pair, pairIndex) => (
				<View key={`pair-${pairIndex}`} className="flex-row gap-x-3 mb-4">
					{pair.map((image) => (
						<View key={image.id} className="flex-1 relative">
							<VisionImage
								imageUrl={image.url}
								isEditing={isEditing}
								onImageChange={handleImageChange(image.id)}
								className="flex-1 w-full aspect-square rounded-xl"
								accessibilityLabel={image.alt || `${block.title} grid image`}
							/>
							{isEditing && (
								<TouchableOpacity
									onPress={() => handleDeleteImage(image.id, image.gridType)}
									className="absolute top-1 right-1 bg-red-500 rounded-full p-1"
								>
									<Ionicons name="close" size={10} color="white" />
								</TouchableOpacity>
							)}
						</View>
					))}
					{/* Fill empty space if only one image in pair */}
					{pair.length === 1 && <View className="flex-1" />}
				</View>
			))}

			{/* Add Image Button */}
			{isEditing && (
				<TouchableOpacity
					onPress={handleAddImage}
					className="bg-white/20 rounded-xl p-4 flex-row items-center justify-center mt-4 border border-foreground/10"
				>
					<Ionicons name="add" size={20} color={colors.foreground} />
					<Text className="text-foreground ml-2 font-medium">Add Image</Text>
				</TouchableOpacity>
			)}
		</View>
	);
}
