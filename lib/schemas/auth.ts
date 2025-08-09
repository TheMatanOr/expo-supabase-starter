import { z } from "zod";

// Email validation schema
export const emailSchema = z
	.string()
	.min(1, "Email is required")
	.email("Invalid email address")
	.toLowerCase();

// Verification code schema
export const verificationCodeSchema = z
	.string()
	.min(6, "Verification code must be 6 digits")
	.max(6, "Verification code must be 6 digits")
	.regex(/^\d{6}$/, "Verification code must contain only numbers");

// Full name schema (optional - can be empty string or valid name)
export const fullNameSchema = z
	.string()
	.refine(
		(val) =>
			val === "" ||
			(val.length >= 2 && val.length <= 50 && /^[a-zA-Z\s'-]+$/.test(val)),
		{
			message:
				"Full name must be empty or 2-50 characters with only letters, spaces, hyphens, and apostrophes",
		},
	);

// Auth step schemas
export const emailStepSchema = z.object({
	email: emailSchema,
});

export const verificationStepSchema = z.object({
	email: emailSchema,
	verificationCode: verificationCodeSchema,
});

export const nameStepSchema = z.object({
	email: emailSchema,
	verificationCode: verificationCodeSchema,
	fullName: fullNameSchema,
});

// Complete auth data schema
export const authDataSchema = z.object({
	email: emailSchema,
	verificationCode: verificationCodeSchema,
	fullName: fullNameSchema,
});

// Auth response schemas
export const authSuccessSchema = z.object({
	user: z.object({
		id: z.string(),
		email: z.string().email(),
		email_confirmed_at: z.string().optional(),
		created_at: z.string(),
	}),
	session: z
		.object({
			access_token: z.string(),
			refresh_token: z.string(),
			expires_at: z.number(),
		})
		.optional(),
});

export const authErrorSchema = z.object({
	message: z.string(),
	status: z.number().optional(),
	code: z.string().optional(),
});

// Type exports
export type EmailStepData = z.infer<typeof emailStepSchema>;
export type VerificationStepData = z.infer<typeof verificationStepSchema>;
export type NameStepData = z.infer<typeof nameStepSchema>;
export type AuthData = z.infer<typeof authDataSchema>;
export type AuthSuccess = z.infer<typeof authSuccessSchema>;
export type AuthError = z.infer<typeof authErrorSchema>;
