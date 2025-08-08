// Welcome types
export interface WelcomeSlide {
	title: string;
	description: string;
	image: any; // React Native image require type
}

export interface WelcomeData {
	slides: WelcomeSlide[];
}

// Add more types here as the app grows
