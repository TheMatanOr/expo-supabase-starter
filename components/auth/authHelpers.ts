import { router } from "expo-router";

/**
 * Handles successful authentication by navigating to protected homepage
 * This can be used for email verification, Google auth, Apple auth, etc.
 */
export const handleAuthSuccess = (authData: {
	email: string;
	method?: string;
}) => {
	console.log("Authentication successful:", authData);

	// Navigate to protected homepage
	router.replace("/(protected)/(tabs)/" as any);
};

/**
 * Handles authentication errors
 */
export const handleAuthError = (error: string, method: string = "email") => {
	console.error(`${method} authentication failed:`, error);
	// TODO: Show error toast/alert to user
};

/**
 * Closes the auth bottom sheet
 */
export const closeAuthSheet = (onClose?: () => void) => {
	if (onClose) {
		onClose();
	}
};
