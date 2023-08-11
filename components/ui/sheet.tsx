"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = ({ className, ...props }: SheetPrimitive.DialogPortalProps) => (
	<SheetPrimitive.Portal className={cn(className)} {...props} />
);

SheetPortal.displayName = SheetPrimitive.Portal.displayName;

const SheetOverlay = React.forwardRef<
	React.ElementRef<typeof SheetPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay> & { className?: string }
>(({ className, ...props }, ref) => (
	<SheetPrimitive.Overlay
		className={cn(
			"fixed inset-0 z-50 bg-mlt-dark-6/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
			className
		)}
		{...props}
		ref={ref}
	/>
));

SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
	"fixed z-50 gap-4 bg-mlt-dark-4 p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
	{
		variants: {
			side: {
				top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
				bottom:
					"inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
				left: "inset-y-0 left-0 h-full w-full xs320:w-3/4 xs320:border-r-2 border-r-mlt-blue-primary/60 drop-shadow-xl data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
				right:
					"inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
			},
		},
		defaultVariants: {
			side: "right",
		},
	}
);

interface SheetContentProps
	extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
		VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
	React.ElementRef<typeof SheetPrimitive.Content>,
	SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
	<SheetPortal>
		<SheetOverlay />
		<SheetPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
			{children}
			<SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-95 ring-offset-mlt-dark-4 transition-opacity hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-mlt-blue-secondary focus:ring-offset-4 disabled:pointer-events-none data-[state=open]:bg-secondary">
				<X className="h-8 w-8 text-mlt-blue-primary emphasize_drop_shadow" strokeWidth={3} />
				<span className="sr-only">Close</span>
			</SheetPrimitive.Close>
		</SheetPrimitive.Content>
	</SheetPortal>
));

SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement> & { className?: string }) => (
	<div className={cn("flex flex-col space-y-4 text-left sm:text-left", className)} {...props} />
);

SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement> & { className?: string }) => (
	<div
		className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
		{...props}
	/>
);

SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
	React.ElementRef<typeof SheetPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title> & { className?: string }
>(({ className, ...props }, ref) => (
	<SheetPrimitive.Title ref={ref} className={cn("", className)} {...props} />
));

SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
	React.ElementRef<typeof SheetPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description> & { className?: string }
>(({ className, ...props }, ref) => (
	<SheetPrimitive.Description
		ref={ref}
		className={cn("text-sm text-muted-foreground", className)}
		{...props}
	/>
));

SheetDescription.displayName = SheetPrimitive.Description.displayName;

const SheetMenu = React.forwardRef<
	React.ElementRef<typeof SheetPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description> & { className?: string }
>(({ className, ...props }, ref) => (
	<SheetPrimitive.Description ref={ref} className={cn("", className)} {...props} />
));

SheetMenu.displayName = SheetPrimitive.Description.displayName;

export {
	Sheet,
	SheetTrigger,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetFooter,
	SheetTitle,
	SheetDescription,
	SheetMenu,
};
