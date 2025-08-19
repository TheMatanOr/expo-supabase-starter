import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Pressable, View, Text, ActivityIndicator } from "react-native";
import { cn } from "@/lib/utils";
import { TextClassContext } from "@/components/ui/text";
import { useColorScheme } from "@/lib/useColorScheme";
import { colors } from "@/constants/colors";

const buttonVariants = cva(
	"group flex items-center justify-center rounded-full web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
	{
		variants: {
			variant: {
				default: "bg-primary web:hover:opacity-90 active:opacity-90",
				destructive: "bg-destructive web:hover:opacity-90 active:opacity-90",
				outline:
					"border border-input bg-background web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent",
				secondary: "bg-secondary web:hover:opacity-80 active:opacity-80",
				ghost:
					"web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent",
				link: "web:underline-offset-4 web:hover:underline web:focus:underline",
				muted: "bg-muted web:hover:opacity-80 active:opacity-80",
			},
			size: {
				default: "h-10 px-4 py-2 native:h-12 native:px-5 native:py-3",
				sm: "h-9  px-3",
				lg: "h-14  px-8 native:h-[60px]",
				icon: "h-10 w-10",
				wide: "h-14 w-full px-8 native:h-[60px]",
			},
			shape: {
				default: "rounded-full",
				rounded: "rounded-2xl",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
			shape: "default",
		},
	},
);

const buttonTextVariants = cva(
	"web:whitespace-nowrap font-semibold text-sm native:text-base text-foreground web:transition-colors",
	{
		variants: {
			variant: {
				default: "text-primary-foreground",
				destructive: "text-destructive-foreground",
				outline: "group-active:text-accent-foreground",
				secondary:
					"text-secondary-foreground group-active:text-secondary-foreground",
				ghost: "group-active:text-accent-foreground",
				link: "text-primary group-active:underline",
				muted: "text-muted-foreground",
			},
			size: {
				default: "",
				sm: "",
				lg: "native:text-xl",
				icon: "",
				wide: "native:text-xl",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
	VariantProps<typeof buttonVariants> & {
		iconStart?: React.ReactNode;
		iconEnd?: React.ReactNode;
		loading?: boolean;
		loadingText?: string;
		elevate?: boolean; // Add shadow elevation
	};

const Button = React.forwardRef<
	React.ComponentRef<typeof Pressable>,
	ButtonProps
>(
	(
		{
			className,
			variant,
			size,
			shape,
			iconStart,
			iconEnd,
			loading = false,
			loadingText,
			elevate = false,
			children,
			...props
		},
		ref,
	) => {
		const { colorScheme } = useColorScheme();
		const isDisabled = props.disabled || loading;

		// Determine button colors for elevation shadow
		const getShadowColor = () => {
			if (!elevate || isDisabled) return "transparent";
			switch (variant) {
				case "default":
					return colors[colorScheme || "dark"].primary;
				case "destructive":
					return colors[colorScheme || "dark"].destructive;
				default:
					return colors[colorScheme || "dark"].foreground;
			}
		};

		const elevationStyle = elevate
			? {
					shadowColor: getShadowColor(),
					shadowOffset: { width: 0, height: isDisabled ? 0 : 4 },
					shadowOpacity: isDisabled ? 0 : 0.3,
					shadowRadius: isDisabled ? 0 : 8,
					elevation: isDisabled ? 0 : 6,
				}
			: {};

		return (
			<TextClassContext.Provider
				value={buttonTextVariants({
					variant,
					size,
					className: "web:pointer-events-none",
				})}
			>
				<Pressable
					className={cn(
						isDisabled && "opacity-50 web:pointer-events-none",
						buttonVariants({ variant, size, shape, className }),
					)}
					style={elevationStyle}
					ref={ref}
					role="button"
					disabled={isDisabled}
					{...props}
				>
					<View className="flex-row items-center justify-center gap-2">
						{loading && (
							<ActivityIndicator
								size="small"
								color={
									variant === "muted"
										? colors[colorScheme || "dark"].mutedForeground
										: colors[colorScheme || "dark"].primaryForeground
								}
							/>
						)}
						{!loading && iconStart && iconStart}
						{typeof children === "string" ? (
							<Text className={buttonTextVariants({ variant, size })}>
								{loading && loadingText ? loadingText : children}
							</Text>
						) : (
							<>{loading && loadingText ? loadingText : children}</>
						)}
						{!loading && iconEnd && iconEnd}
					</View>
				</Pressable>
			</TextClassContext.Provider>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
