import { z } from "zod";

// Option schema for onboarding steps
export const onboardingOptionSchema = z.object({
	id: z.string(),
	label: z.string(),
	description: z.string().optional(),
});

// Simple onboarding form data schema
export const onboardingFormDataSchema = z.object({
	full_name: z.string().min(1, "Please enter your full name"),
	gender: z.string().min(1, "Please select your gender"),
	vision: z.string().min(1, "Please write your vision"),
	count_per_day: z.number().positive("Count per day must be a positive number"),
});

// Simple validation function for onboarding data
export const validateOnboardingData = (data: unknown) => {
	return onboardingFormDataSchema.parse(data);
};

// User profile schema (for database)
export const userProfileSchema = z.object({
	id: z.string().uuid(),
	email: z.string().email(),
	full_name: z.string(),
	gender: z.string().optional(),
	vision: z.string(),
	count_per_day: z.number(),
	onboarding_completed: z.boolean().default(false),
	onboarding_data: onboardingFormDataSchema.optional(),
	created_at: z.string(),
	updated_at: z.string(),
});

// Type exports
export type OnboardingOption = z.infer<typeof onboardingOptionSchema>;
export type OnboardingFormData = z.infer<typeof onboardingFormDataSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
