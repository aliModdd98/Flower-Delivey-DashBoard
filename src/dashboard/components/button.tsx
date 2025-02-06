import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../lib/utils"; // Assuming cn is a utility function to join class names
const buttonVariants = cva(
  "inline-flex items-center h-10 px-4 py-2 justify-center rounded-md text-sm font-medium ring-offset-background transition-all duration-200 ease-in-out transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary-hover hover:scale-105 active:scale-95 focus:ring-primary",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-105 active:scale-95 focus:ring-destructive",
        outline:
          "border border-gray-300 bg-background text-foreground hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95 focus:ring-accent",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105 active:scale-95 focus:ring-secondary",
        ghost:
          "hover:bg-primary  hover:text-primary-foreground hover:scale-105 active:scale-95 focus:ring-primary",
        muted:
          "bg-muted text-muted-foreground hover:bg-muted/80 hover:scale-105 active:scale-95 focus:ring-muted",
        accent:
          "bg-accent text-accent-foreground hover:bg-accent/80 hover:scale-105 active:scale-95 focus:ring-accent",
        outlineSecondary:
          "border border-secondary text-secondary-foreground hover:bg-secondary/90 hover:scale-105 active:scale-95 focus:ring-secondary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
