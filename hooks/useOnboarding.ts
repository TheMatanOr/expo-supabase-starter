import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	onboardingFormDataSchema,
	validateOnboardingData,
	type OnboardingFormData,
} from "@/lib/schemas/onboarding";

// Default form values
const defaultValues: OnboardingFormData = {
	full_name: "",
	gender: "",
	vision: "",
	count_per_day: 10,
};

export const useOnboarding = () => {
	// Initialize React Hook Form with Zod validation
	const form = useForm<OnboardingFormData>({
		resolver: zodResolver(onboardingFormDataSchema),
		defaultValues,
		mode: "onSubmit", // Only validate on submit
	});

	const { formState, setValue, getValues, trigger, reset, watch } = form;

	// Watch all form values for real-time updates
	const watchedValues = watch();

	// Handle form field updates
	const updateField = (
		field: keyof OnboardingFormData,
		value: string | number,
	) => {
		if (field === "count_per_day") {
			// Convert string to number for count_per_day
			setValue(field, Number(value), {
				shouldValidate: false,
				shouldDirty: true,
				shouldTouch: true,
			});
		} else {
			setValue(field as any, value, {
				shouldValidate: false,
				shouldDirty: true,
				shouldTouch: true,
			});
		}
	};

	// Check if an option is selected for single-select fields
	const isOptionSelected = (
		field: keyof OnboardingFormData,
		optionId: string,
	): boolean => {
		const currentValue = watchedValues[field];
		return currentValue === optionId || currentValue === Number(optionId);
	};

	// Check if a step can continue (has valid selections)
	const canContinueStep = (
		field: keyof OnboardingFormData,
		required: boolean = true,
	): boolean => {
		if (!required) return true;

		const value = watchedValues[field];

		// For string fields, check that the value exists and isn't just whitespace
		if (typeof value === "string") {
			return Boolean(value && value.trim().length > 0);
		}

		// For number fields, check that it's a valid positive number
		if (typeof value === "number") {
			return value > 0;
		}

		return false;
	};

	// Check if all steps are completed
	const isFormComplete = (): boolean => {
		return (
			canContinueStep("full_name") &&
			canContinueStep("gender") &&
			canContinueStep("vision") &&
			canContinueStep("count_per_day")
		);
	};

	// Complete onboarding (validate and return data)
	const completeOnboarding = async (): Promise<{
		success: boolean;
		data?: OnboardingFormData;
		error?: string;
	}> => {
		try {
			// Trigger validation for all fields
			const isValid = await trigger();

			if (!isValid) {
				return {
					success: false,
					error: "Please complete all onboarding steps before continuing",
				};
			}

			const formData = getValues();

			// Validate the complete form data
			const validatedData = validateOnboardingData(formData);

			return { success: true, data: validatedData };
		} catch (error: any) {
			console.error("Complete onboarding error:", error);
			return {
				success: false,
				error: error?.message || "Failed to complete onboarding",
			};
		}
	};

	// Get progress information
	const getProgress = (currentStepIndex: number, totalSteps: number) => {
		// Count completed steps
		let completedSteps = 0;
		if (canContinueStep("full_name", false)) completedSteps++;
		if (canContinueStep("gender", false)) completedSteps++;
		if (canContinueStep("vision", false)) completedSteps++;
		if (canContinueStep("count_per_day", false)) completedSteps++;

		return {
			currentStep: currentStepIndex + 1,
			totalSteps,
			completedSteps,
			completionPercentage:
				totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0,
		};
	};

	// Reset form to initial state
	const resetForm = () => {
		reset(defaultValues);
	};

	return {
		// Form state
		formState,
		watchedValues,
		errors: formState.errors,
		isValid: formState.isValid,
		isDirty: formState.isDirty,

		// Data getters
		getFormData: getValues,
		isFormComplete,

		// Actions
		updateField,
		isOptionSelected,
		canContinueStep,
		completeOnboarding,
		getProgress,
		resetForm,

		// Form methods
		setValue,
		getValues,
		trigger,
	};
};
