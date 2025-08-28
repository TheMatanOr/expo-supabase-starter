import { create } from "zustand";
import { VisionData, VisionBlock, VisionImage } from "@/lib/types/vision";
import { supabase } from "@/config/supabase";

interface VisionStore {
	// State
	visionData: VisionData | null;
	isLoading: boolean;
	error: string | null;

	// Actions
	loadVisionData: (userId: string) => Promise<void>;
	updateBlock: (blockId: string, updates: Partial<VisionBlock>) => void;
	addBlock: (
		block: Omit<VisionBlock, "id" | "createdAt" | "updatedAt">,
	) => Promise<string>;
	removeBlock: (blockId: string) => void;
	reorderBlocks: (blocks: VisionBlock[]) => void;
	updateBlockImage: (blockId: string, imageId: string, newUrl: string) => void;
	saveToSupabase: () => Promise<boolean>;
	reset: () => void;
}

// Sample data generator
const generateSampleVisionData = (userId: string): VisionData => ({
	userId,
	lastUpdated: new Date().toISOString(),
	blocks: [
		{
			id: "health-block",
			title: "Health & Wellness",
			content:
				"I am committed to maintaining optimal physical and mental health. I exercise regularly, eat nutritious foods, and prioritize rest and recovery. My body is strong, energetic, and resilient.",
			images: [
				{
					id: "health-main",
					url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
					gridType: "1",
					alt: "Healthy lifestyle",
				},
				{
					id: "health-1",
					url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
					gridType: "2",
					alt: "Healthy food",
				},
				{
					id: "health-2",
					url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
					gridType: "2",
					alt: "Fitness",
				},
			],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
		{
			id: "career-block",
			title: "Career & Success",
			content:
				"I am building a successful and fulfilling career that aligns with my values and passions. I continuously learn, grow, and contribute meaningfully to my field while maintaining work-life balance.",
			images: [
				{
					id: "career-main",
					url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
					gridType: "1",
					alt: "Professional success",
				},
				{
					id: "career-1",
					url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
					gridType: "2",
					alt: "Team collaboration",
				},
				{
					id: "career-2",
					url: "https://images.unsplash.com/photo-1486312338219-ce68e2c6b81d",
					gridType: "2",
					alt: "Innovation",
				},
			],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
		{
			id: "relationships-block",
			title: "Relationships & Family",
			content:
				"I nurture meaningful relationships with family and friends. I am surrounded by people who love and support me, and I give love and support in return. My relationships are built on trust, respect, and genuine connection.",
			images: [
				{
					id: "relationships-main",
					url: "https://images.unsplash.com/photo-1511895426328-dc8714191300",
					gridType: "1",
					alt: "Family time",
				},
				{
					id: "relationships-1",
					url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac",
					gridType: "2",
					alt: "Friends",
				},
				{
					id: "relationships-2",
					url: "https://images.unsplash.com/photo-1543269664-56d93c1b41a6",
					gridType: "2",
					alt: "Love",
				},
			],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
	],
});

export const useVisionStore = create<VisionStore>((set, get) => ({
	// Initial state
	visionData: null,
	isLoading: false,
	error: null,

	// Load vision data from Supabase or create sample data
	loadVisionData: async (userId: string) => {
		set({ isLoading: true, error: null });

		try {
			// Try to load from Supabase profiles table
			const { data: profile, error } = await supabase
				.from("profiles")
				.select("vision")
				.eq("user_id", userId)
				.single();

			let visionData: VisionData;

			if (error || !profile?.vision) {
				// Create sample data if none exists
				visionData = generateSampleVisionData(userId);
			} else {
				// Parse existing vision data
				try {
					visionData = JSON.parse(profile.vision);
				} catch (parseError) {
					console.warn("Failed to parse vision data, using sample data");
					visionData = generateSampleVisionData(userId);
				}
			}

			set({ visionData, isLoading: false });
		} catch (error) {
			console.error("Failed to load vision data:", error);
			set({
				error: "Failed to load vision data",
				isLoading: false,
				visionData: generateSampleVisionData(userId),
			});
		}
	},

	// Update a specific block
	updateBlock: (blockId: string, updates: Partial<VisionBlock>) => {
		const { visionData } = get();
		if (!visionData) return;

		const updatedBlocks = visionData.blocks.map((block) =>
			block.id === blockId
				? { ...block, ...updates, updatedAt: new Date().toISOString() }
				: block,
		);

		set({
			visionData: {
				...visionData,
				blocks: updatedBlocks,
				lastUpdated: new Date().toISOString(),
			},
		});
	},

	// Add a new block
	addBlock: async (
		blockData: Omit<VisionBlock, "id" | "createdAt" | "updatedAt">,
	): Promise<string> => {
		const { visionData } = get();
		if (!visionData) return "";

		const blockId = `block-${Date.now()}`;
		const newBlock: VisionBlock = {
			...blockData,
			id: blockId,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		set({
			visionData: {
				...visionData,
				blocks: [...visionData.blocks, newBlock],
				lastUpdated: new Date().toISOString(),
			},
		});

		return blockId;
	},

	// Remove a block
	removeBlock: (blockId: string) => {
		const { visionData } = get();
		if (!visionData) return;

		const updatedBlocks = visionData.blocks.filter(
			(block) => block.id !== blockId,
		);

		set({
			visionData: {
				...visionData,
				blocks: updatedBlocks,
				lastUpdated: new Date().toISOString(),
			},
		});
	},

	// Reorder blocks
	reorderBlocks: (blocks: VisionBlock[]) => {
		const { visionData } = get();
		if (!visionData) return;

		set({
			visionData: {
				...visionData,
				blocks,
				lastUpdated: new Date().toISOString(),
			},
		});
	},

	// Update a specific image in a block
	updateBlockImage: (blockId: string, imageId: string, newUrl: string) => {
		const { visionData } = get();
		if (!visionData) return;

		const updatedBlocks = visionData.blocks.map((block) => {
			if (block.id === blockId) {
				const updatedImages = block.images.map((image) =>
					image.id === imageId ? { ...image, url: newUrl } : image,
				);
				return {
					...block,
					images: updatedImages,
					updatedAt: new Date().toISOString(),
				};
			}
			return block;
		});

		set({
			visionData: {
				...visionData,
				blocks: updatedBlocks,
				lastUpdated: new Date().toISOString(),
			},
		});
	},

	// Save to Supabase
	saveToSupabase: async (): Promise<boolean> => {
		const { visionData } = get();
		if (!visionData) return false;

		try {
			const { error } = await supabase
				.from("profiles")
				.update({
					vision: JSON.stringify(visionData),
					updated_at: new Date().toISOString(),
				})
				.eq("user_id", visionData.userId);

			if (error) {
				console.error("Failed to save vision data:", error);
				set({ error: "Failed to save changes" });
				return false;
			}

			return true;
		} catch (error) {
			console.error("Failed to save vision data:", error);
			set({ error: "Failed to save changes" });
			return false;
		}
	},

	// Reset store
	reset: () => {
		set({ visionData: null, isLoading: false, error: null });
	},
}));
