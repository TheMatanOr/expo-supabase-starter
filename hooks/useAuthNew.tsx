import {
	createContext,
	PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

import { Session } from "@supabase/supabase-js";

import { supabase } from "@/config/supabase";
import { verificationStepSchema } from "@/lib/schemas/auth";

type AuthState = {
	initialized: boolean;
	session: Session | null;
	signUp: (email: string, password: string) => Promise<void>;
	signIn: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthState>({
	initialized: false,
	session: null,
	signUp: async () => {},
	signIn: async () => {},
	signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: PropsWithChildren) {
	const [initialized, setInitialized] = useState(false);
	const [session, setSession] = useState<Session | null>(null);

	// const signUp = async (email: string, password: string) => {
	// 	const { data, error } = await supabase.auth.signUp({
	// 		email,
	// 		password,
	// 	});

	// 	if (error) {
	// 		console.error("Error signing up:", error);
	// 		return;
	// 	}

	// 	if (data.session) {
	// 		setSession(data.session);
	// 		console.log("User signed up:", data.user);
	// 	} else {
	// 		console.log("No user returned from sign up");
	// 	}
	// };

	// const signIn = async (email: string, password: string) => {
	// 	const { data, error } = await supabase.auth.signInWithPassword({
	// 		email,
	// 		password,
	// 	});

	// 	if (error) {
	// 		console.error("Error signing in:", error);
	// 		return;
	// 	}

	// 	if (data.session) {
	// 		setSession(data.session);
	// 		console.log("User signed in:", data.user);
	// 	} else {
	// 		console.log("No user returned from sign in");
	// 	}
	// };

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

				const { data, error } = await supabase.auth.verifyOtp({
					email: validatedData.email,
					token: validatedData.verificationCode,
					type: "email",
				});

				if (error) {
					return { success: false, error: error.message };
				}

				if (data.user && data.session) {
					// Save user profile with onboarding data (required)
					if (onboardingData) {
					} else {
						// This shouldn't happen as onboarding is required before auth
						throw new Error("Onboarding data is required to complete signup");
					}

					return {
						success: true,
						data: { user: data.user, session: data.session },
					};
				}

				return { success: false, error: error };
			} catch (error: any) {
				return { success: false, error: error };
			} finally {
			}
		},
		[],
	);

	const signOut = async () => {
		const { error } = await supabase.auth.signOut();

		if (error) {
			console.error("Error signing out:", error);
			return;
		} else {
			console.log("User signed out");
		}
	};

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});

		setInitialized(true);
	}, []);

	return (
		<AuthContext.Provider
			value={{
				initialized,
				session,
				signUp,
				signIn,
				signOut,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
