import React, {
	createContext,
	useContext,
	useState,
	useCallback,
	ReactNode,
} from "react";

export interface BottomSheetItem {
	label: string;
	value: string;
	disabled?: boolean;
	description?: string;
}

interface BottomSheetContextType {
	isVisible: boolean;
	title: string;
	items: BottomSheetItem[];
	selectedValues: string[];
	searchable: boolean;
	multiple: boolean;
	searchQuery: string;
	onSelect: (value: string) => void;
	onClose: () => void;
	setSearchQuery: (query: string) => void;
	showBottomSheet: (options: {
		title: string;
		items: BottomSheetItem[];
		selectedValues: string[];
		searchable?: boolean;
		multiple?: boolean;
		onSelect: (value: string) => void;
		onClose: () => void;
	}) => void;
	hideBottomSheet: () => void;
}

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(
	undefined,
);

interface BottomSheetProviderProps {
	children: ReactNode;
}

export const BottomSheetProvider: React.FC<BottomSheetProviderProps> = ({
	children,
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const [title, setTitle] = useState("");
	const [items, setItems] = useState<BottomSheetItem[]>([]);
	const [selectedValues, setSelectedValues] = useState<string[]>([]);
	const [searchable, setSearchable] = useState(false);
	const [multiple, setMultiple] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [onSelectCallback, setOnSelectCallback] = useState<
		(value: string) => void
	>(() => () => {});
	const [onCloseCallback, setOnCloseCallback] = useState<() => void>(
		() => () => {},
	);

	const showBottomSheet = useCallback(
		(options: {
			title: string;
			items: BottomSheetItem[];
			selectedValues: string[];
			searchable?: boolean;
			multiple?: boolean;
			onSelect: (value: string) => void;
			onClose: () => void;
		}) => {
			setTitle(options.title);
			setItems(options.items);
			setSelectedValues(options.selectedValues);
			setSearchable(options.searchable || false);
			setMultiple(options.multiple || false);
			setSearchQuery("");
			setOnSelectCallback(() => options.onSelect);
			setOnCloseCallback(() => options.onClose);
			setIsVisible(true);
		},
		[],
	);

	const hideBottomSheet = useCallback(() => {
		setIsVisible(false);
		setSearchQuery("");
		// Call the close callback after hiding
		setTimeout(() => {
			onCloseCallback();
		}, 300); // Wait for animation to complete
	}, [onCloseCallback]);

	const handleSelect = useCallback(
		(value: string) => {
			// Update selected values in real-time for multiple selection
			if (multiple) {
				setSelectedValues((prevSelected) => {
					const currentValues = [...prevSelected];
					const valueIndex = currentValues.indexOf(value);

					if (valueIndex >= 0) {
						// Remove if already selected
						currentValues.splice(valueIndex, 1);
					} else {
						// Add if not selected
						currentValues.push(value);
					}

					return currentValues;
				});

				// Call the callback after state update to avoid scheduling conflicts
				onSelectCallback(value);
			} else {
				// Single selection - update state and call callback
				// Note: Don't close immediately, let SelectBottomSheet handle animated close
				setSelectedValues([value]);
				onSelectCallback(value);
			}
		},
		[onSelectCallback, multiple],
	);

	const value: BottomSheetContextType = {
		isVisible,
		title,
		items,
		selectedValues,
		searchable,
		multiple,
		searchQuery,
		onSelect: handleSelect,
		onClose: hideBottomSheet,
		setSearchQuery,
		showBottomSheet,
		hideBottomSheet,
	};

	return (
		<BottomSheetContext.Provider value={value}>
			{children}
		</BottomSheetContext.Provider>
	);
};

export const useBottomSheet = (): BottomSheetContextType => {
	const context = useContext(BottomSheetContext);
	if (!context) {
		throw new Error("useBottomSheet must be used within a BottomSheetProvider");
	}
	return context;
};
