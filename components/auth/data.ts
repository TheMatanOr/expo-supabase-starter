// Auth flow text content and demo data
export const authTexts = {
	welcome: {
		signup: {
			title: "Almost there!",
			subtitle: "You're ready to go. Let's create your account",
		},
		login: {
			title: "Welcome back",
			subtitle: "Sign in to continue to your account",
		},
		buttons: {
			continueWithEmail: "Continue with Email",
			termsText: "By continuing, you agree to our",
			termsLink: "Terms of Use",
		},
		socialLogin: {
			divider: "or",
		},
	},
	email: {
		signup: {
			title: "Enter your email",
			subtitle: "We'll send you a verification code",
		},
		login: {
			title: "Enter your email",
			subtitle: "We'll send you a verification code",
		},
		placeholder: "Enter your email",
		button: "Continue",
	},
	verification: {
		title: "Check your email",
		subtitle: "We sent a verification code to",
		button: "Continue",
		resend: {
			text: "Didn't receive the code?",
			link: "Resend",
		},
	},
	name: {
		title: "What's your name?",
		subtitle: "Help us personalize your experience",
		placeholder: "Enter your full name",
		button: "Start",
	},
	success: {
		signup: {
			title: "Welcome",
			subtitle: "Your account has been created successfully",
			celebration: "🎉 You're all set! Welcome to the app.",
		},
		login: {
			title: "Welcome back",
			subtitle: "You're successfully signed in",
			celebration: "🎉 Welcome back! Great to see you again.",
		},
		button: "Get Started",
	},
};

// Demo data for development
export const authDemoData = {
	emails: ["john@example.com", "jane@example.com", "demo@example.com"],
	names: ["John Doe", "Jane Smith", "Demo User"],
	verificationCodes: ["12345", "67890", "11111"],
};

// Constants
export const authConstants = {
	verificationCodeLength: 5,
	animationDuration: 200,
	snapPoints: {
		welcome: "55%",
		other: "90%",
	},
	stepOrder: ["welcome", "email", "verification"] as const,
};
