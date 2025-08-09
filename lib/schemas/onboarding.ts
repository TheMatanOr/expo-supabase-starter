import { z } from "zod";

// Option schema for onboarding steps
export const onboardingOptionSchema = z.object({
	id: z.string(),
	label: z.string(),
	description: z.string().optional(),
});

// Individual step schemas based on your actual onboarding steps
export const fitnessLevelSchema = z
	.array(z.string())
	.length(1, "Please select your fitness level");

export const goalsSchema = z
	.array(z.string())
	.min(1, "Please select at least one goal");

export const workoutFrequencySchema = z
	.array(z.string())
	.length(1, "Please select your workout frequency");

// Complete onboarding data schema
export const onboardingDataSchema = z.object({
	fitness_level: fitnessLevelSchema,
	goals: goalsSchema,
	workout_frequency: workoutFrequencySchema,
});

// Validation only occurs when completing onboarding, not on every step
export const validateCompleteOnboarding = (
	selections: Record<string, string[]>,
) => {
	// Check that all required steps have selections
	const hasAllSelections =
		selections["fitness_level"]?.length > 0 &&
		selections["goals"]?.length > 0 &&
		selections["workout_frequency"]?.length > 0;

	if (!hasAllSelections) {
		throw new Error("Please complete all onboarding steps before continuing");
	}

	return transformOnboardingSelections(selections);
};

// User profile schema (for database)
export const userProfileSchema = z.object({
	id: z.string().uuid(),
	email: z.string().email(),
	full_name: z.string(),
	onboarding_completed: z.boolean().default(false),
	onboarding_data: onboardingDataSchema.optional(),
	created_at: z.string(),
	updated_at: z.string(),
});

// Onboarding step validation schema
export const onboardingStepSchema = z.object({
	stepId: z.string(),
	selections: z.array(z.string()),
	required: z.boolean(),
});

// Type exports
export type OnboardingOption = z.infer<typeof onboardingOptionSchema>;
export type OnboardingData = z.infer<typeof onboardingDataSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type OnboardingStepData = z.infer<typeof onboardingStepSchema>;

// Helper function to validate onboarding step
export const validateOnboardingStep = (
	stepId: string,
	selections: string[],
	required: boolean,
) => {
	const stepData = { stepId, selections, required };
	return onboardingStepSchema.parse(stepData);
};

// Helper function to transform onboarding selections to structured data
export const transformOnboardingSelections = (
	selections: Record<string, string[]>,
): OnboardingData => {
	return onboardingDataSchema.parse({
		fitness_level: selections["fitness_level"] || [],
		goals: selections["goals"] || [],
		workout_frequency: selections["workout_frequency"] || [],
	});
};
