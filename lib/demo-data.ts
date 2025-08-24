export interface DayStatus {
	date: string;
	day: string;
	completed: boolean;
	workoutType?: string;
}

export interface StreakData {
	currentStreak: number;
	longestStreak: number;
	weeklyProgress: DayStatus[];
	totalWorkouts: number;
	monthlyGoal: number;
	monthlyProgress: number;
}

// Demo data for streak tracking
export const demoStreakData: StreakData = {
	currentStreak: 4,
	longestStreak: 12,
	totalWorkouts: 28,
	monthlyGoal: 20,
	monthlyProgress: 18,
	weeklyProgress: [
		{
			date: "2024-01-18",
			day: "Thu",
			completed: true,
			workoutType: "Strength Training",
		},
		{
			date: "2024-01-19",
			day: "Fri",
			completed: false,
		},
		{
			date: "2024-01-20",
			day: "Sat",
			completed: false,
		},
		{
			date: "2024-01-21",
			day: "Sun",
			completed: true,
			workoutType: "Cardio",
		},
		{
			date: "2024-01-22",
			day: "Mon",
			completed: true,
			workoutType: "HIIT",
		},
		{
			date: "2024-01-23",
			day: "Tue",
			completed: true,
			workoutType: "Strength Training",
		},
		{
			date: "2024-01-24",
			day: "Wed",
			completed: true,
			workoutType: "Yoga",
		},
	],
};
