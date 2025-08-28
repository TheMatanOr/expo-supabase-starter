# Vision Components

## Overview

A comprehensive vision board system with dynamic data management, image uploads, and persistent storage.

## Components

### VisionBlock Component

A reusable vision block component that displays a title, content, and images in different grid layouts.

**Features:**

- **Dynamic Content**: Title and content are editable
- **Image Management**: Supports main images (grid type 1) and grid images (grid type 2)
- **Edit Mode**: Toggle between view and edit modes
- **Auto-save**: Changes are automatically saved to Supabase
- **Image Upload**: Upload and replace images via VisionImage component

**Props:**

- `block: VisionBlock` - The vision block data
- `isEditing?: boolean` - Whether the block is in edit mode
- `onUpdate?: (block: VisionBlock) => void` - Callback when block is updated
- `onToggleEdit?: () => void` - Callback to toggle edit mode

### VisionImage Component

A reusable image component with editing and lightbox functionality.

**Features:**

- **Two States**: Edit mode and view mode
- **Image Upload**: Select and upload images from device gallery in edit mode
- **Lightbox**: View images in full-screen lightbox in view mode
- **Supabase Integration**: Automatically uploads images to Supabase storage

**Props:**

- `imageUrl?: string` - URL of the image to display
- `isEditing?: boolean` - Whether the component is in editing mode
- `onImageChange?: (newImageUrl: string) => void` - Callback when image is changed
- `className?: string` - Custom CSS classes
- `accessibilityLabel?: string` - Accessibility label for the image

## Data Structure

### VisionData

```typescript
interface VisionData {
	userId: string;
	blocks: VisionBlock[];
	lastUpdated: string;
}
```

### VisionBlock

```typescript
interface VisionBlock {
	id: string;
	title: string;
	content: string;
	images: VisionImage[];
	createdAt: string;
	updatedAt: string;
}
```

### VisionImage

```typescript
interface VisionImage {
	id: string;
	url: string;
	gridType: "1" | "2"; // 1 = full width, 2 = grid layout
	alt?: string;
}
```

## State Management

The vision system uses Zustand for state management with the `useVisionStore` hook.

**Key Features:**

- **Load Data**: Loads vision data from Supabase or creates sample data
- **Update Blocks**: Updates individual blocks with optimistic updates
- **Auto-save**: Automatically saves changes to Supabase
- **Error Handling**: Comprehensive error handling with user feedback

## Usage

```tsx
import { VisionBlock } from "@/components/vision";
import { useVisionStore } from "@/lib/stores/vision-store";

// In your component
const { visionData, updateBlock } = useVisionStore();

// Render vision blocks
{
	visionData?.blocks.map((block) => (
		<VisionBlock
			key={block.id}
			block={block}
			isEditing={editingBlockId === block.id}
			onUpdate={handleBlockUpdate}
			onToggleEdit={() => handleToggleEdit(block.id)}
		/>
	));
}
```

## Storage

- **Images**: Stored in Supabase storage bucket 'vision-images'
- **Data**: Stored as JSON in the `profiles.vision` column
- **Auto-save**: Changes are automatically persisted to Supabase

## Sample Data

The system comes with three pre-configured vision blocks:

1. **Health & Wellness** - Focus on physical and mental health
2. **Career & Success** - Professional goals and achievements
3. **Relationships & Family** - Personal connections and love

Each block includes relevant sample images and inspiring content that users can customize.
