import { useProgressAnimation } from "@/hooks/useProgressAnimation";

export const useSemiCircularProgressAnimation = (
	progress: number,
	circumference: number,
) => {
	return useProgressAnimation({
		progress,
		circumference,
		duration: 1500,
	});
};

