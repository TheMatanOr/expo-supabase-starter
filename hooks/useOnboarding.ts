import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	onboardingDataSchema,
	type OnboardingData,
} from "@/lib/schemas/onboarding";

// Form data type for React Hook Form
export interface OnboardingFormData {
	full_name: string[];
	fitness_level: string[];
	goals: string[];
	workout_frequency: string[];
}

// Default form values
const defaultValues: OnboardingFormData = {
	full_name: [],
	fitness_level: [],
	goals: [],
	workout_frequency: [],
};

export const useOnboarding = () => {
	// Initialize React Hook Form with Zod validation
	const form = useForm<OnboardingFormData>({
		resolver: zodResolver(onboardingDataSchema),
		defaultValues,
		mode: "onSubmit", // Only validate on submit, not on every change
	});

	// Watch all form values for real-time updates
	const watchedValues = useWatch({ control: form.control });
	const { formState, setValue, getValues, trigger, reset } = form;

	// Handle option selection for a step
	const handleOptionSelect = (
		stepId: keyof OnboardingFormData,
		optionId: string,
		multiSelect: boolean = false,
	) => {
		const currentSelections = getValues(stepId) || [];

		let newSelections: string[];

		if (multiSelect) {
			// Multi-select: toggle the option
			newSelections = currentSelections.includes(optionId)
				? currentSelections.filter((id) => id !== optionId)
				: [...currentSelections, optionId];
		} else {
			// Single-select: always replace with new selection (no deselection)
			newSelections = [optionId];
		}

		// Update form value (don't trigger validation during selection)
		setValue(stepId, newSelections, {
			shouldValidate: false, // Don't validate during selection
			shouldDirty: true,
			shouldTouch: true,
		});
	};

	// Check if an option is selected
	const isOptionSelected = (
		stepId: keyof OnboardingFormData,
		optionId: string,
	): boolean => {
		const currentSelections = watchedValues[stepId] || [];
		return currentSelections.includes(optionId);
	};

	// Check if a step can continue (has valid selections)
	const canContinueStep = (
		stepId: keyof OnboardingFormData,
		required: boolean = true,
	): boolean => {
		if (!required) return true;

		const selections = watchedValues[stepId] || [];
		const hasSelections = selections.length > 0;

		// Don't check field errors during step navigation, only check if user made selections
		return hasSelections;
	};

	// Get structured onboarding data (validated) - only when form is complete
	const getOnboardingData = (): OnboardingData | null => {
		try {
			const formData = getValues();

			// Check if form has any data before validating
			const hasAnyData =
				formData.full_name.length > 0 ||
				formData.fitness_level.length > 0 ||
				formData.goals.length > 0 ||
				formData.workout_frequency.length > 0;

			if (!hasAnyData) {
				return null; // Don't validate empty form
			}

			return onboardingDataSchema.parse(formData);
		} catch (error) {
			console.error("Invalid onboarding data:", error);
			return null;
		}
	};

	// Check if all steps are completed and valid
	const isFormComplete = (): boolean => {
		const formData = getValues();

		// Check that all required fields have selections
		const hasAllSelections =
			formData.full_name.length > 0 &&
			formData.fitness_level.length > 0 &&
			formData.goals.length > 0 &&
			formData.workout_frequency.length > 0;

		// Check that form is valid (no validation errors)
		const isValid = formState.isValid;

		return hasAllSelections && isValid;
	};

	// Complete onboarding (validate and return data)
	const completeOnboarding = async (): Promise<{
		success: boolean;
		data?: OnboardingData;
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

			const onboardingData = getOnboardingData();

			if (!onboardingData) {
				return {
					success: false,
					error: "Invalid onboarding data",
				};
			}

			return { success: true, data: onboardingData };
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
		const formData = getValues();

		// Count completed steps
		let completedSteps = 0;
		if (formData.full_name.length > 0) completedSteps++;
		if (formData.fitness_level.length > 0) completedSteps++;
		if (formData.goals.length > 0) completedSteps++;
		if (formData.workout_frequency.length > 0) completedSteps++;

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

		// Validation state
		errors: formState.errors,
		isValid: formState.isValid,
		isDirty: formState.isDirty,

		// Data getters (only use getOnboardingData when completing onboarding!)
		getOnboardingData,
		isFormComplete,

		// Raw form data (for passing to SignUpFlow before validation)
		getRawFormData: getValues,

		// Actions
		handleOptionSelect,
		isOptionSelected,
		canContinueStep,
		completeOnboarding,
		getProgress,
		resetForm,

		// Form methods (expose if needed)
		setValue,
		getValues,
		trigger,
	};
};
