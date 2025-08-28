import React, { useEffect, useState } from "react";
import { View, Alert, TouchableOpacity, FlatList } from "react-native";
import { Text } from "@/components/ui/text";
import { VisionBlock } from "@/components/vision";
import NewBlockBottomSheet from "@/components/vision/new-block-bottom-sheet";
import GardientBackground from "@/components/ui/gardient-background";
import { useVisionStore } from "@/lib/stores/vision-store";
import { useAuth } from "@/hooks/useAuthComplete";
import { VisionBlock as VisionBlockType } from "@/lib/types/vision";
import { Ionicons } from "@expo/vector-icons";
import { H2, P } from "@/components/ui/typography";

export default function Vision() {
	const { user } = useAuth();
	const {
		visionData,
		isLoading,
		error,
		loadVisionData,
		updateBlock,
		addBlock,
		removeBlock,
		reorderBlocks,
		saveToSupabase,
	} = useVisionStore();

	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [newlyCreatedBlockId, setNewlyCreatedBlockId] = useState<string | null>(
		null,
	);
	const [showNewBlockModal, setShowNewBlockModal] = useState(false);

	// Load vision data when component mounts
	useEffect(() => {
		if (user?.id) {
			loadVisionData(user.id);
		}
	}, [user?.id, loadVisionData]);

	// Handle block updates
	const handleBlockUpdate = (updatedBlock: VisionBlockType) => {
		updateBlock(updatedBlock.id, updatedBlock);
	};

	// Handle showing add block modal
	const handleShowAddBlock = () => {
		setShowNewBlockModal(true);
	};

	// Handle adding new block from modal
	const handleAddBlock = async (title: string, content: string) => {
		const newBlock = {
			title,
			content,
			images: [],
		};
		const blockId = await addBlock(newBlock);

		// Set editing mode and mark this block as newly created
		setIsEditing(true);
		setNewlyCreatedBlockId(blockId);

		// Clear the newly created flag after a delay
		setTimeout(() => {
			setNewlyCreatedBlockId(null);
		}, 100);
	};

	// Handle deleting a block
	const handleDeleteBlock = (blockId: string) => {
		Alert.alert(
			"Delete Block",
			"Are you sure you want to delete this vision block?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: () => removeBlock(blockId),
				},
			],
		);
	};

	// Handle saving all changes
	const handleSave = async () => {
		setIsSaving(true);
		const success = await saveToSupabase();
		setIsSaving(false);

		if (success) {
			Alert.alert("Saved", "Your vision board has been saved successfully!");
		} else {
			Alert.alert("Save Error", "Failed to save changes. Please try again.");
		}
	};

	// Handle moving blocks up/down
	const handleMoveBlock = (blockId: string, direction: "up" | "down") => {
		if (!visionData?.blocks) return;

		const currentIndex = visionData.blocks.findIndex(
			(block) => block.id === blockId,
		);
		if (currentIndex === -1) return;

		const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
		if (newIndex < 0 || newIndex >= visionData.blocks.length) return;

		const newBlocks = [...visionData.blocks];
		const [movedBlock] = newBlocks.splice(currentIndex, 1);
		newBlocks.splice(newIndex, 0, movedBlock);

		reorderBlocks(newBlocks);
	};

	// Render individual vision block
	const renderVisionBlock = ({
		item,
		index,
	}: {
		item: VisionBlockType;
		index: number;
	}) => {
		const isNewBlock = item.id === newlyCreatedBlockId;
		const isFirst = index === 0;
		const isLast = index === (visionData?.blocks.length || 0) - 1;

		return (
			<View className="relative mb-8">
				{/* Move buttons - positioned outside the block */}
				{isEditing && (visionData?.blocks.length || 0) > 1 && (
					<>
						{!isFirst && (
							<TouchableOpacity
								onPress={() => handleMoveBlock(item.id, "up")}
								className="absolute -top-4 left-4 bg-blue-500 rounded-full p-2 z-10"
							>
								<Ionicons name="chevron-up" size={16} color="white" />
							</TouchableOpacity>
						)}
						{!isLast && (
							<TouchableOpacity
								onPress={() => handleMoveBlock(item.id, "down")}
								className="absolute -top-4 right-4 bg-blue-500 rounded-full p-2 z-10"
							>
								<Ionicons name="chevron-down" size={16} color="white" />
							</TouchableOpacity>
						)}
					</>
				)}

				<VisionBlock
					block={item}
					isEditing={isEditing}
					onUpdate={handleBlockUpdate}
					onDelete={() => handleDeleteBlock(item.id)}
					autoFocus={isNewBlock}
				/>
			</View>
		);
	};

	if (isLoading) {
		return (
			<GardientBackground>
				<View className="flex-1 justify-center items-center px-6">
					<Text className="text-lg">Loading your vision...</Text>
				</View>
			</GardientBackground>
		);
	}

	if (error) {
		return (
			<GardientBackground>
				<View className="flex-1 justify-center items-center px-6">
					<Text className="text-lg text-red-500 text-center mb-4">{error}</Text>
					<TouchableOpacity
						onPress={() => user?.id && loadVisionData(user.id)}
						className="bg-blue-500 px-4 py-2 rounded-lg"
					>
						<Text className="text-white">Retry</Text>
					</TouchableOpacity>
				</View>
			</GardientBackground>
		);
	}

	return (
		<GardientBackground>
			<View className="flex-1">
				{/* Header */}
				<View className="px-6 py-4 pb-2">
					<View className="flex-row justify-between items-center mb-2">
						<H2 className="">My Vision Board</H2>
						<View className="flex-row gap-3">
							<TouchableOpacity
								onPress={() => setIsEditing(!isEditing)}
								className={`px-4 py-2 rounded-full ${
									isEditing ? "bg-green-500" : "bg-blue-500"
								}`}
							>
								<Text className="text-white font-medium">
									{isEditing ? "Done" : "Edit"}
								</Text>
							</TouchableOpacity>
							{isEditing && (
								<TouchableOpacity
									onPress={handleShowAddBlock}
									className="bg-white/20 rounded-full p-2"
								>
									<Ionicons name="add" size={24} color="white" />
								</TouchableOpacity>
							)}
						</View>
					</View>
					<P className="">Visualize your dreams and make them reality</P>
					{isEditing && (
						<Text className="text-white/60 text-sm mt-2">
							Use up/down arrows to reorder blocks
						</Text>
					)}
					{isSaving && (
						<Text className="text-yellow-300 text-sm mt-2">
							Saving changes...
						</Text>
					)}
				</View>

				{/* Vision Blocks */}
				{visionData?.blocks.length ? (
					<FlatList
						data={visionData.blocks}
						keyExtractor={(item) => item.id}
						renderItem={renderVisionBlock}
						contentContainerStyle={{
							paddingHorizontal: 24,
							paddingBottom: isEditing ? 100 : 24,
						}}
						showsVerticalScrollIndicator={false}
					/>
				) : (
					<View className="flex-1 justify-center items-center px-6">
						<Text className="text-white/60 text-center">
							No vision blocks yet. Tap the + button to create your first vision
							block!
						</Text>
					</View>
				)}
			</View>

			{/* Floating Save Button */}
			{isEditing && (
				<TouchableOpacity
					onPress={handleSave}
					disabled={isSaving}
					className="absolute bottom-6 right-6 bg-green-500 rounded-full p-4 shadow-lg"
					style={{ elevation: 5 }}
				>
					{isSaving ? (
						<Ionicons name="hourglass" size={24} color="white" />
					) : (
						<Ionicons name="save" size={24} color="white" />
					)}
				</TouchableOpacity>
			)}

			{/* New Block Bottom Sheet */}
			<NewBlockBottomSheet
				visible={showNewBlockModal}
				onClose={() => setShowNewBlockModal(false)}
				onSave={handleAddBlock}
			/>
		</GardientBackground>
	);
}
