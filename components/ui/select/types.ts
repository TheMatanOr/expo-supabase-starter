export interface SelectOption {
	label: string;
	value: string;
	disabled?: boolean;
	description?: string;
}

export interface SelectInputProps {
	/**
	 * The placeholder text to show when no value is selected
	 */
	placeholder?: string;

	/**
	 * The options available for selection
	 */
	options: SelectOption[];

	/**
	 * The currently selected value(s)
	 */
	value?: string | string[];

	/**
	 * Callback fired when the selection changes
	 */
	onValueChange: (value: string | string[]) => void;

	/**
	 * Whether multiple values can be selected
	 */
	multiple?: boolean;

	/**
	 * Whether the select should be searchable
	 */
	searchable?: boolean;

	/**
	 * The title to display in the bottom sheet header
	 */
	title: string;

	/**
	 * Whether the input is disabled
	 */
	disabled?: boolean;

	/**
	 * Custom placeholder text when searching
	 */
	searchPlaceholder?: string;

	/**
	 * Maximum number of items to show before scrolling
	 */
	maxVisibleItems?: number;

	/**
	 * Custom class name for styling
	 */
	className?: string;

	/**
	 * Whether to show selected count for multiple selection
	 */
	showSelectedCount?: boolean;

	/**
	 * Custom text to show when no options match search
	 */
	noOptionsText?: string;

	/**
	 * Function to filter options when searching
	 */
	filterFunction?: (option: SelectOption, searchQuery: string) => boolean;
}
