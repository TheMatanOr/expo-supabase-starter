import { useState, useCallback } from "react";

export function useSignUpSheet() {
	const [isVisible, setIsVisible] = useState(false);

	const showSignUpSheet = useCallback(() => {
		setIsVisible(true);
	}, []);

	const hideSignUpSheet = useCallback(() => {
		setIsVisible(false);
	}, []);

	return {
		isVisible,
		showSignUpSheet,
		hideSignUpSheet,
	};
}
