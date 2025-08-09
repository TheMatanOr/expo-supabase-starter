import { useCallback, useEffect } from "react";
import { router } from "expo-router";
import { supabase } from "@/config/supabase";
import { useAuthStore } from "@/lib/stores/auth-store";

import {
	emailStepSchema,
	verificationStepSchema,
	type AuthData,
	type AuthError,
} from "@/lib/schemas/auth";
import type { AuthStep } from "@/components/auth/types";

export const useAuth = () => {
	const authStore = useAuthStore();

	// Initialize auth state from Supabase session
	useEffect(() => {
		let mounted = true;

		const initializeAuth = async () => {
			try {
				const {
					data: { session },
					error,
				} = await supabase.auth.getSession();

				if (error) {
					console.error("Error getting session:", error);
					return;
				}

				if (mounted && session) {
					authStore.setAuthenticated(true);
					authStore.setUser(session.user as any);
					authStore.setSession(session as any);
				}
			} catch (error) {
				console.error("Failed to initialize auth:", error);
			}
		};

		initializeAuth();

		// Listen for auth state changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			if (!mounted) return;

			if (event === "SIGNED_IN" && session) {
				authStore.setAuthenticated(true);
				authStore.setUser(session.user as any);
				authStore.setSession(session as any);
				authStore.clearError();
			} else if (event === "SIGNED_OUT") {
				authStore.logout();
			}
		});

		return () => {
			mounted = false;
			subscription.unsubscribe();
		};
	}, [authStore]);

	// Send email verification code
	const sendVerificationCode = useCallback(
		async (email: string, mode: "signup" | "login" = "signup") => {
			console.log("useAuth: sendVerificationCode called with email:", email);
			try {
				// Validate email first
				const validatedData = emailStepSchema.parse({ email });
				console.log("useAuth: Email validation passed:", validatedData);

				authStore.setSendingCode(true);
				authStore.clearError();

				// For signup: we'll handle user existence after the OTP is sent
				// This prevents creating partial user records during the check

				console.log(`useAuth: Calling Supabase signInWithOtp for ${mode}...`);
				const { data, error } = await supabase.auth.signInWithOtp({
					email: validatedData.email,
					options: {
						shouldCreateUser: mode === "signup", // Only create user for signup
						data: {
							// Will be updated with full name and onboarding data later
						},
					},
				});

				console.log("useAuth: Supabase OTP response:", { data, error });

				if (error) {
					const authError: AuthError = {
						message: error.message,
						status: error.status,
						code: error.name,
					};
					console.log("useAuth: Supabase OTP error:", authError);

					// For signup: check if error indicates user already exists
					if (
						mode === "signup" &&
						(error.message?.toLowerCase().includes("already") ||
							error.message?.toLowerCase().includes("exist") ||
							error.status === 422)
					) {
						console.log(
							"useAuth: User already exists during signup, showing continue anyway option",
						);
						const errorMessage = "User already exists";
						authStore.setFieldErrors({
							email: errorMessage,
							showContinueAnyway: true,
						});
						return {
							success: false,
							error: {
								message: errorMessage,
								status: 422,
								code: "user_already_exists",
								showContinueAnyway: true,
							},
						};
					}

					// For login: check if user doesn't exist
					if (
						mode === "login" &&
						(error.message?.toLowerCase().includes("not found") ||
							error.message?.toLowerCase().includes("invalid") ||
							error.message?.toLowerCase().includes("user") ||
							error.status === 400)
					) {
						const errorMessage = "No account found with this email address";
						authStore.setFieldErrors({ email: errorMessage });
						return { success: false, error: authError };
					}

					// Set as field error for email-related errors, otherwise as general error
					if (
						error.message?.toLowerCase().includes("email") ||
						error.message?.toLowerCase().includes("invalid") ||
						error.status === 422
					) {
						authStore.setFieldErrors({ email: error.message });
					} else {
						authStore.setError(authError);
					}

					return { success: false, error: authError };
				}

				// Update auth data with validated email
				authStore.setAuthData({ email: validatedData.email });
				console.log("useAuth: Email verification code sent successfully");

				return { success: true, data };
			} catch (error: any) {
				console.log("useAuth: Validation or other error:", error);

				let errorMessage = "Invalid email format";

				// Handle Zod validation errors
				if (error?.issues?.[0]) {
					errorMessage = error.issues[0].message;
				} else if (error?.message) {
					errorMessage = error.message;
				}

				const authError: AuthError = {
					message: errorMessage,
					status: 400,
				};

				// Always set email errors as field errors
				authStore.setFieldErrors({ email: errorMessage });

				return { success: false, error: authError };
			} finally {
				authStore.setSendingCode(false);
			}
		},
		[authStore],
	);

	// Verify email code and complete authentication
	const verifyCode = useCallback(
		async (
			email: string,
			code: string,
			fullName?: string,
			onboardingData?: any,
		) => {
			try {
				// Validate the verification data
				const validatedData = verificationStepSchema.parse({
					email,
					verificationCode: code,
				});

				authStore.setVerifying(true);
				authStore.clearError();

				const { data, error } = await supabase.auth.verifyOtp({
					email: validatedData.email,
					token: validatedData.verificationCode,
					type: "email",
				});

				if (error) {
					const authError: AuthError = {
						message: error.message,
						status: error.status,
						code: error.name,
					};
					authStore.setError(authError);
					return { success: false, error: authError };
				}

				if (data.user && data.session) {
					// Update auth store
					authStore.setAuthenticated(true);
					authStore.setUser(data.user as any);
					authStore.setSession(data.session as any);
					authStore.setAuthData({
						email: validatedData.email,
						verificationCode: validatedData.verificationCode,
						fullName: fullName || "",
					});

					// Save user profile with onboarding data (required)
					if (onboardingData) {
						await saveUserProfile(data.user.id, {
							email: validatedData.email,
							fullName: fullName || null, // null if not provided
							onboardingData,
						});
					} else {
						// This shouldn't happen as onboarding is required before auth
						throw new Error("Onboarding data is required to complete signup");
					}

					return {
						success: true,
						data: { user: data.user, session: data.session },
					};
				}

				const authError: AuthError = {
					message: "Verification failed - no user or session returned",
					status: 401,
				};
				authStore.setError(authError);
				return { success: false, error: authError };
			} catch (error: any) {
				const authError: AuthError = {
					message: error?.issues?.[0]?.message || "Invalid verification code",
					status: 400,
				};

				if (error?.issues?.[0]?.path?.[0] === "verificationCode") {
					authStore.setFieldErrors({ verificationCode: authError.message });
				} else {
					authStore.setError(authError);
				}

				return { success: false, error: authError };
			} finally {
				authStore.setVerifying(false);
			}
		},
		[authStore],
	);

	// Save user profile with onboarding data
	const saveUserProfile = useCallback(
		async (
			userId: string,
			profileData: {
				email: string;
				fullName: string | null;
				onboardingData: any;
			},
		) => {
			try {
				// Transform onboarding data to separate columns
				const onboardingData = profileData.onboardingData;
				console.log(
					"Saving user profile with onboarding data:",
					onboardingData,
				);

				const { data, error } = await supabase
					.from("user_profiles")
					.upsert({
						id: userId,
						email: profileData.email,
						full_name: profileData.fullName,
						// Extract onboarding data into separate columns
						fitness_level: onboardingData?.fitness_level?.[0] || null, // Single select
						goals: onboardingData?.goals || [], // Multi select array
						workout_frequency: onboardingData?.workout_frequency?.[0] || null, // Single select
						updated_at: new Date().toISOString(),
					})
					.select()
					.single();

				if (error) {
					console.error("Failed to save user profile:", error);
					throw error;
				}

				console.log("User profile saved successfully:", data);
				return data;
			} catch (error) {
				console.error("Error saving user profile:", error);
				throw error;
			}
		},
		[],
	);

	// Complete authentication flow and navigate
	const completeAuth = useCallback(async () => {
		try {
			authStore.setLoading(true);

			// Navigate to protected route
			router.replace("/(protected)/(tabs)/" as any);
		} catch (error) {
			console.error("Failed to complete authentication:", error);
			const authError: AuthError = {
				message: "Failed to complete authentication",
				status: 500,
			};
			authStore.setError(authError);
		} finally {
			authStore.setLoading(false);
		}
	}, [authStore]);

	// Sign out
	const signOut = useCallback(async () => {
		try {
			authStore.setLoading(true);

			const { error } = await supabase.auth.signOut();

			if (error) {
				console.error("Error signing out:", error);
				const authError: AuthError = {
					message: error.message,
					status: error.status || 500,
				};
				authStore.setError(authError);
				return { success: false, error: authError };
			}

			// Reset stores
			authStore.logout();

			// Navigate to public route
			router.replace("/welcome");

			return { success: true };
		} catch (error: any) {
			console.error("Failed to sign out:", error);
			const authError: AuthError = {
				message: "Failed to sign out",
				status: 500,
			};
			authStore.setError(authError);
			return { success: false, error: authError };
		} finally {
			authStore.setLoading(false);
		}
	}, [authStore]);

	// Handle step changes with validation
	const handleStepChange = useCallback(
		(step: AuthStep) => {
			authStore.setCurrentStep(step);
			// Clear all errors and field errors when changing steps
			authStore.clearError();
			authStore.setFieldErrors(null);
		},
		[authStore],
	);

	// Handle auth data changes with validation
	const handleAuthDataChange = useCallback(
		(data: Partial<AuthData>) => {
			authStore.setAuthData(data);
			authStore.clearError();
		},
		[authStore],
	);

	return {
		// State
		authData: authStore.authData,
		currentStep: authStore.currentStep,
		isLoading: authStore.isLoading,
		isVerifying: authStore.isVerifying,
		isSendingCode: authStore.isSendingCode,
		isAuthenticated: authStore.isAuthenticated,
		user: authStore.user,
		session: authStore.session,
		error: authStore.error,
		fieldErrors: authStore.fieldErrors,

		// Actions
		sendVerificationCode,
		verifyCode,
		completeAuth,
		signOut,
		handleStepChange,
		handleAuthDataChange,
		clearError: authStore.clearError,
		reset: authStore.reset,
	};
};
