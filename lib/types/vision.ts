export type GridType = "1" | "2";

export interface VisionImage {
	id: string;
	url: string;
	gridType: GridType;
	alt?: string;
}

export interface VisionBlock {
	id: string;
	title: string;
	content: string;
	images: VisionImage[];
	createdAt: string;
	updatedAt: string;
}

export interface VisionData {
	userId: string;
	blocks: VisionBlock[];
	lastUpdated: string;
}

export interface VisionBlockProps {
	block: VisionBlock;
	isEditing?: boolean;
	onUpdate?: (updatedBlock: VisionBlock) => void;
	onDelete?: () => void;
	autoFocus?: boolean;
}

export interface AddImageOptions {
	gridType: GridType;
	onImageAdded: (image: VisionImage) => void;
}

// Helper types for editing
export interface VisionBlockUpdate {
	title?: string;
	content?: string;
	images?: VisionImage[];
}
