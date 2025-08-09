export interface WelcomeSlide {
	id: number;
	title: string;
	description: string;
	image: any; // require() image
}

export interface WelcomeScreenProps {
	onContinue?: () => void;
	onLogin?: () => void;
}

export interface AnimationConfig {
	duration: number;
	useNativeDriver: boolean;
}
