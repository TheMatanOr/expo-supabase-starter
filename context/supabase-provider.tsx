import {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";

import { Session } from "@supabase/supabase-js";

import { supabase } from "@/config/supabase";
import { Tables } from "@/lib/supabase";

type UserProfile = Tables<"user_profiles">;

type AuthState = {
	initialized: boolean;
	session: Session | null;
	user: UserProfile | null;
	signUp: (email: string, password: string) => Promise<void>;
	signIn: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthState>({
	initialized: false,
	session: null,
	user: null,
	signUp: async () => {},
	signIn: async () => {},
	signOut: async () => {},
});

/**
 * Main authentication hook for general app usage
 *
 * Provides basic Supabase authentication functionality including:
 * - Session management and initialization
 * - User profile fetching from database
 * - Simple email/password authentication
 * - Auth state throughout the app
 *
 * For OTP-based onboarding authentication, use useOTPAuth from @/hooks/useOTPAuth
 */
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: PropsWithChildren) {
	const [initialized, setInitialized] = useState(false);
	const [session, setSession] = useState<Session | null>(null);
	const [user, setUser] = useState<UserProfile | null>(null);

	const fetchUserProfile = async (userId: string) => {
		try {
			const { data, error } = await supabase
				.from("user_profiles")
				.select("*")
				.eq("id", userId)
				.single();

			if (error) {
				console.error("Error fetching user profile:", error);
				return null;
			}

			return data;
		} catch (error) {
			console.error("Error fetching user profile:", error);
			return null;
		}
	};

	const signUp = async (email: string, password: string) => {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
		});

		if (error) {
			console.error("Error signing up:", error);
			return;
		}

		if (data.session) {
			setSession(data.session);
			// Fetch user profile after successful signup
			if (data.user) {
				const userProfile = await fetchUserProfile(data.user.id);
				setUser(userProfile);
			}
			console.log("User signed up:", data.user);
		} else {
			console.log("No user returned from sign up");
		}
	};

	const signIn = async (email: string, password: string) => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			console.error("Error signing in:", error);
			return;
		}

		if (data.session) {
			setSession(data.session);
			// Fetch user profile after successful signin
			if (data.user) {
				const userProfile = await fetchUserProfile(data.user.id);
				setUser(userProfile);
			}
			console.log("User signed in:", data.user);
		} else {
			console.log("No user returned from sign in");
		}
	};

	const signOut = async () => {
		const { error } = await supabase.auth.signOut();

		if (error) {
			console.error("Error signing out:", error);
			return;
		} else {
			setUser(null);
			console.log("User signed out");
		}
	};

	useEffect(() => {
		supabase.auth.getSession().then(async ({ data: { session } }) => {
			setSession(session);
			// Fetch user profile if session exists
			if (session?.user) {
				const userProfile = await fetchUserProfile(session.user.id);
				setUser(userProfile);
			}
		});

		supabase.auth.onAuthStateChange(async (_event, session) => {
			setSession(session);
			// Fetch user profile when auth state changes
			if (session?.user) {
				const userProfile = await fetchUserProfile(session.user.id);
				setUser(userProfile);
			} else {
				setUser(null);
			}
		});

		setInitialized(true);
	}, []);

	return (
		<AuthContext.Provider
			value={{
				initialized,
				session,
				user,
				signUp,
				signIn,
				signOut,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
