import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { supabase } from "@/config/supabase";
import { decode } from "base64-arraybuffer";
import { useAuth } from "@/hooks/useAuthComplete";
import { Ionicons } from "@expo/vector-icons";

interface VisionImageProps {
	imageUrl?: string;
	isEditing?: boolean;
	onImageChange?: (newImageUrl: string) => void;
	className?: string;
	accessibilityLabel?: string;
}

export default function VisionImage({
	imageUrl,
	isEditing = false,
	onImageChange,
	className = "w-full aspect-square rounded-xl",
	accessibilityLabel = "Vision image",
}: VisionImageProps) {
	const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl);
	const [isUploading, setIsUploading] = useState(false);
	const { user } = useAuth();

	// Sync with prop changes (handles deletion from parent)
	useEffect(() => {
		setCurrentImageUrl(imageUrl);
	}, [imageUrl]);

	const uploadImageToSupabase = async (imageUri: string) => {
		try {
			setIsUploading(true);

			// Check if user is authenticated
			if (!user) {
				Alert.alert(
					"Authentication Required",
					"Please sign in to upload images.",
				);
				return null;
			}

			// Read the file as base64 using expo-file-system
			const base64Data = await FileSystem.readAsStringAsync(imageUri, {
				encoding: FileSystem.EncodingType.Base64,
			});

			// Convert base64 to ArrayBuffer
			const arrayBuffer = decode(base64Data);

			// Generate a unique filename
			const fileExt = imageUri.split(".").pop()?.toLowerCase() || "jpg";
			const fileName = `vision-${user?.id || "anonymous"}-${Date.now()}.${fileExt}`;
			const filePath = fileName; // Simple path for public bucket
			console.log("Uploading to path:", filePath);

			// Upload to Supabase Storage
			const { error } = await supabase.storage
				.from("vision-images")
				.upload(filePath, arrayBuffer, {
					contentType: `image/${fileExt}`,
					upsert: true, // Allow overwriting files
				});

			if (error) {
				console.log("22");
				console.error("Upload error:", error);
				Alert.alert(
					"Upload Error",
					"Failed to upload image. Please try again.",
				);
				return null;
			}

			// Get the public URL
			const { data: urlData } = supabase.storage
				.from("vision-images")
				.getPublicUrl(filePath);

			return urlData.publicUrl;
		} catch (error) {
			console.error("Upload error:", error);
			Alert.alert("Upload Error", "Failed to upload image. Please try again.");
			return null;
		} finally {
			setIsUploading(false);
		}
	};

	const pickImage = async () => {
		try {
			// Request permission
			const { status } =
				await ImagePicker.requestMediaLibraryPermissionsAsync();
			if (status !== "granted") {
				Alert.alert(
					"Permission Required",
					"Please grant camera roll permission to upload images.",
				);
				return;
			}

			// Launch image picker
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [1, 1], // Square aspect ratio
				quality: 0.8,
			});

			if (!result.canceled && result.assets[0]) {
				const imageUri = result.assets[0].uri;

				// Upload to Supabase
				const uploadedUrl = await uploadImageToSupabase(imageUri);

				if (uploadedUrl) {
					setCurrentImageUrl(uploadedUrl);
					onImageChange?.(uploadedUrl);
				}
			}
		} catch (error) {
			console.error("Image picker error:", error);
			Alert.alert("Error", "Failed to select image. Please try again.");
		}
	};

	const handleImagePress = () => {
		if (isEditing) {
			pickImage();
		}
		// Removed lightbox functionality for non-edit mode
	};

	const isPlaceholder = !currentImageUrl;

	// Render placeholder (no image)
	if (isPlaceholder) {
		return (
			<View className={className}>
				{isEditing ? (
					<TouchableOpacity
						onPress={handleImagePress}
						disabled={isUploading}
						className="w-full aspect-square rounded-xl bg-gray-200 flex items-center justify-center relative"
					>
						{isUploading ? (
							<Ionicons name="refresh" size={32} color="#6B7280" />
						) : (
							<Ionicons name="add" size={32} color="#6B7280" />
						)}
					</TouchableOpacity>
				) : (
					<View className="w-full aspect-square rounded-xl bg-gray-200 flex items-center justify-center">
						<Ionicons name="image-outline" size={32} color="#9CA3AF" />
					</View>
				)}
			</View>
		);
	}

	// Render image (with or without edit overlay)
	return (
		<View className={className}>
			{isEditing ? (
				<TouchableOpacity
					onPress={handleImagePress}
					disabled={isUploading}
					className="relative"
				>
					<Image
						source={{ uri: currentImageUrl }}
						className="w-full aspect-square rounded-xl"
						contentFit="cover"
						accessibilityLabel={accessibilityLabel}
					/>

					{/* Edit overlay */}
					<View className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
						<View className="bg-white/90 rounded-full p-3">
							{isUploading ? (
								<Ionicons name="refresh" size={24} color="#374151" />
							) : (
								<Ionicons name="refresh-outline" size={24} color="#374151" />
							)}
						</View>
					</View>
				</TouchableOpacity>
			) : (
				<Image
					source={{ uri: currentImageUrl }}
					className="w-full aspect-square rounded-xl"
					contentFit="cover"
					accessibilityLabel={accessibilityLabel}
				/>
			)}
		</View>
	);
}
