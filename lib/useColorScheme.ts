import { colors } from "@/constants/colors";

export function useColorScheme() {
	// Return a single unified theme - no more light/dark switching
	return {
		colorScheme: "unified",
		isDarkColorScheme: false, // Always false since we have one theme
		colors, // Direct access to the unified colors
	};
}
