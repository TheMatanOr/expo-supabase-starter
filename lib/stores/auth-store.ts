import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { AuthData, AuthError, AuthSuccess } from "../schemas/auth";
import type { AuthStep } from "../../components/auth/types";

export interface AuthState {
	// Auth data
	authData: AuthData;
	currentStep: AuthStep;

	// Loading states
	isLoading: boolean;
	isVerifying: boolean;
	isSendingCode: boolean;

	// Auth state
	isAuthenticated: boolean;
	user: AuthSuccess["user"] | null;
	session: AuthSuccess["session"] | null;

	// Error handling
	error: AuthError | null;
	fieldErrors: Partial<
		Record<keyof AuthData | string, string | boolean>
	> | null;

	// Actions
	setAuthData: (data: Partial<AuthData>) => void;
	setCurrentStep: (step: AuthStep) => void;
	setLoading: (loading: boolean) => void;
	setVerifying: (verifying: boolean) => void;
	setSendingCode: (sending: boolean) => void;
	setAuthenticated: (authenticated: boolean) => void;
	setUser: (user: AuthSuccess["user"] | null) => void;
	setSession: (session: AuthSuccess["session"] | null) => void;
	setError: (error: AuthError | null) => void;
	setFieldErrors: (
		errors: Partial<Record<keyof AuthData | string, string | boolean>> | null,
	) => void;
	clearError: () => void;
	reset: () => void;
	logout: () => void;
}

const initialState = {
	authData: {
		email: "",
		verificationCode: "",
		fullName: "",
	},
	currentStep: "welcome" as AuthStep,
	isLoading: false,
	isVerifying: false,
	isSendingCode: false,
	isAuthenticated: false,
	user: null,
	session: null,
	error: null,
	fieldErrors: null,
};

export const useAuthStore = create<AuthState>()(
	subscribeWithSelector((set, get) => ({
		...initialState,

		setAuthData: (data) =>
			set((state) => ({
				authData: { ...state.authData, ...data },
				fieldErrors: null, // Clear field errors when data changes
			})),

		setCurrentStep: (step) =>
			set(() => ({
				currentStep: step,
				error: null, // Clear general errors when changing steps
			})),

		setLoading: (loading) => set(() => ({ isLoading: loading })),

		setVerifying: (verifying) => set(() => ({ isVerifying: verifying })),

		setSendingCode: (sending) => set(() => ({ isSendingCode: sending })),

		setAuthenticated: (authenticated) =>
			set(() => ({ isAuthenticated: authenticated })),

		setUser: (user) => set(() => ({ user })),

		setSession: (session) => set(() => ({ session })),

		setError: (error) =>
			set(() => ({
				error,
				isLoading: false,
				isVerifying: false,
				isSendingCode: false,
			})),

		setFieldErrors: (errors) => set(() => ({ fieldErrors: errors })),

		clearError: () => set(() => ({ error: null, fieldErrors: null })),

		reset: () =>
			set(() => ({
				...initialState,
			})),

		logout: () =>
			set(() => ({
				...initialState,
				isAuthenticated: false,
				user: null,
				session: null,
			})),
	})),
);
