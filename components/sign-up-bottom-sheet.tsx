import React from "react";
import { SignUpFlow } from "@/components/auth";
import type { AuthData } from "@/components/auth";

interface SignUpBottomSheetProps {
	isVisible: boolean;
	onClose: () => void;
}

export const SignUpBottomSheet: React.FC<SignUpBottomSheetProps> = ({
	isVisible,
	onClose,
}) => {
	const handleSuccess = (data: AuthData) => {
		console.log("Sign up successful:", data);
		// TODO: Handle successful signup (e.g., navigate to main app)
	};

	return (
		<SignUpFlow
			isVisible={isVisible}
			onClose={onClose}
			onSuccess={handleSuccess}
		/>
	);
};
