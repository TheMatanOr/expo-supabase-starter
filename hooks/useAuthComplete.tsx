import {
	createContext,
	PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/config/supabase";
import { emailSchema, verificationCodeSchema } from "@/lib/schemas/auth";
import { OnboardingData } from "@/lib/types";
import { Database, Tables } from "@/lib/supabase";

// Types
interface AuthError {
	message: string;
	code?: string;
}

interface AuthResponse {
	success: boolean;
	error?: AuthError;
	data?: any;
}

interface AuthState {
	// Session state
	initialized: boolean;
	session: Session | null;
	user: Tables<"profiles"> | null;

	// Loading state
	isLoading: boolean;

	// Auth methods
	signInOTP: (
		email: string,
		onboardingData: OnboardingData,
	) => Promise<AuthResponse>;
	verifyCode: (email: string, code: string) => Promise<AuthResponse>;
	signOut: () => Promise<AuthResponse>;
}

// Create context with default values
const AuthContext = createContext<AuthState>({
	initialized: false,
	session: null,
	user: null,
	isLoading: false,
	signInOTP: async () => ({ success: false }),
	verifyCode: async () => ({ success: false }),
	signOut: async () => ({ success: false }),
});

// Custom hook to use auth context
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

// Auth Provider Component
export function AuthProvider({ children }: PropsWithChildren) {
	// State management
	const [initialized, setInitialized] = useState(false);
	const [session, setSession] = useState<Session | null>(null);
	const [user, setUser] = useState<Tables<"profiles"> | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	// Send verification code to email
	const signInOTP = useCallback(
		async (
			email: string,
			onboardingData: OnboardingData,
		): Promise<AuthResponse> => {
			try {
				setIsLoading(true);
				console.log(onboardingData);
				// Validate email format
				const validatedEmail = emailSchema.parse(email);

				console.log("Sending verification code to:", validatedEmail);
				// Check if user already exists in user_profile table
				const { data: isUserExists, error: profileError } = await supabase
					.from("user_profiles")
					.select("id")
					.eq("email", validatedEmail)
					.single();

				// if (isUserExists) {
				// 	const authError: AuthError = {
				// 		message: "User already exists",
				// 		code: "USER_EXISTS",
				// 	};
				// 	return { success: false, error: authError };
				// }
				// Send OTP via Supabase
				const { data, error: supabaseError } =
					await supabase.auth.signInWithOtp({
						email: validatedEmail,

						options: {
							data: onboardingData,

							shouldCreateUser: true,
						},
					});

				if (supabaseError) {
					console.log(supabaseError);
					const authError: AuthError = {
						message: supabaseError.message,
						code: supabaseError.name,
					};
					return { success: false, error: authError };
				}

				console.log("Verification code sent successfully");
				return { success: true, data };
			} catch (error: any) {
				let errorMessage = "Failed to send verification code";

				// Handle Zod validation errors
				if (error?.issues?.[0]) {
					errorMessage = error.issues[0].message;
				} else if (error?.message) {
					errorMessage = error.message;
				}

				const authError: AuthError = {
					message: errorMessage,
					code: "SEND_CODE_ERROR",
				};

				return { success: false, error: authError };
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	// Verify OTP code
	const verifyCode = useCallback(
		async (email: string, code: string): Promise<AuthResponse> => {
			try {
				setIsLoading(true);

				// Validate inputs
				const validatedEmail = emailSchema.parse(email);
				const validatedCode = verificationCodeSchema.parse(code);

				console.log("Verifying code for:", validatedEmail);

				// Verify OTP with Supabase
				const { data, error: supabaseError } = await supabase.auth.verifyOtp({
					email: validatedEmail,
					token: validatedCode,
					type: "email",
				});

				if (supabaseError) {
					const authError: AuthError = {
						message: supabaseError.message,
						code: supabaseError.name,
					};
					return { success: false, error: authError };
				}

				if (data.user && data.session) {
					// Session will be automatically updated via auth state change listener
					console.log("Code verified successfully, user authenticated");
					return {
						success: true,
						data: { user: data.user, session: data.session },
					};
				}

				const authError: AuthError = {
					message: "Verification failed - no session created",
					code: "VERIFICATION_FAILED",
				};
				return { success: false, error: authError };
			} catch (error: any) {
				let errorMessage = "Invalid verification code";

				// Handle Zod validation errors
				if (error?.issues?.[0]) {
					errorMessage = error.issues[0].message;
				} else if (error?.message) {
					errorMessage = error.message;
				}

				const authError: AuthError = {
					message: errorMessage,
					code: "VERIFY_CODE_ERROR",
				};

				return { success: false, error: authError };
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	// Sign out user
	const signOut = useCallback(async (): Promise<AuthResponse> => {
		try {
			setIsLoading(true);

			console.log("Signing out user...");

			const { error: supabaseError } = await supabase.auth.signOut();

			if (supabaseError) {
				const authError: AuthError = {
					message: supabaseError.message,
					code: supabaseError.name,
				};
				return { success: false, error: authError };
			}

			// Session will be cleared automatically via auth state change listener
			console.log("User signed out successfully");
			return { success: true };
		} catch (error: any) {
			const authError: AuthError = {
				message: error?.message || "Failed to sign out",
				code: "SIGNOUT_ERROR",
			};
			return { success: false, error: authError };
		} finally {
			setIsLoading(false);
		}
	}, []);

	const setUserProfile = useCallback(async (userId: string | null) => {
		if (!userId) {
			setUser(null);
			return;
		}
		const { data, error } = await supabase
			.from("profiles")
			.select("*")
			.eq("id", userId)
			.single();

		if (error) {
			console.error("Error getting user profile:", error);
			setUser(null);
			return;
		}
		setUser(data as Tables<"profiles">);
		return;
	}, []);
	// Initialize auth state and set up listeners
	useEffect(() => {
		let mounted = true;

		// Get initial session
		const initializeAuth = async () => {
			try {
				const {
					data: { session },
					error,
				} = await supabase.auth.getSession();

				if (error) {
					console.error("Error getting initial session:", error);
					return;
				}

				if (mounted) {
					setSession(session);
					setUserProfile(session?.user?.id ?? null);

					setInitialized(true);
				}
			} catch (error) {
				console.error("Failed to initialize auth:", error);
				if (mounted) {
					setInitialized(true);
				}
			}
		};

		// Set up auth state change listener
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			if (!mounted) return;

			console.log("Auth state changed:", event, session?.user?.email);

			setSession(session);

			setUserProfile(session?.user?.id ?? null);
		});

		initializeAuth();

		// Cleanup
		return () => {
			mounted = false;
			subscription.unsubscribe();
		};
	}, []);

	// Context value
	const value: AuthState = {
		// Session state
		initialized,
		session,
		user,

		// Loading state
		isLoading,

		// Auth methods
		signInOTP,
		verifyCode,
		signOut,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Export both the hook and provider for convenience
export default { useAuth, AuthProvider };
