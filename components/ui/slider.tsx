"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { cn } from "@/lib/utils";

interface SliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  formatLabel?: (value: number) => string;
  className?: string;
}

export function RangeSlider({
  min,
  max,
  value,
  onChange,
  step = 1,
  formatLabel = (v) => v.toString(),
  className,
}: SliderProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = React.useState<"min" | "max" | null>(null);

  const getPercentage = (val: number) => ((val - min) / (max - min)) * 100;

  const handleMouseDown = (e: React.MouseEvent, type: "min" | "max") => {
    e.preventDefault();
    setDragging(type);
  };

  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (!dragging || !trackRef.current) return;

      const rect = trackRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const newValue = Math.round((percentage / 100) * (max - min) + min);
      const steppedValue = Math.round(newValue / step) * step;

      if (dragging === "min") {
        onChange([Math.min(steppedValue, value[1] - step), value[1]]);
      } else {
        onChange([value[0], Math.max(steppedValue, value[0] + step)]);
      }
    },
    [dragging, min, max, step, value, onChange]
  );

  const handleMouseUp = React.useCallback(() => {
    setDragging(null);
  }, []);

  React.useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragging, handleMouseMove, handleMouseUp]);

  return (
    <div className={cn("py-4", className)}>
      <div className="flex justify-between mb-2 text-sm text-muted-foreground">
        <span>{formatLabel(value[0])}</span>
        <span>{formatLabel(value[1])}</span>
      </div>
      <div
        ref={trackRef}
        className="relative h-2 bg-muted rounded-full cursor-pointer"
      >
        {/* Active track */}
        <div
          className="absolute h-full bg-primary rounded-full"
          style={{
            left: `${getPercentage(value[0])}%`,
            right: `${100 - getPercentage(value[1])}%`,
          }}
        />

        {/* Min thumb */}
        <motion.div
          className={cn(
            "absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-primary rounded-full border-2 border-background shadow-lg cursor-grab",
            dragging === "min" && "cursor-grabbing scale-110"
          )}
          style={{ left: `${getPercentage(value[0])}%` }}
          onMouseDown={(e) => handleMouseDown(e, "min")}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 1.15 }}
        />

        {/* Max thumb */}
        <motion.div
          className={cn(
            "absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-primary rounded-full border-2 border-background shadow-lg cursor-grab",
            dragging === "max" && "cursor-grabbing scale-110"
          )}
          style={{ left: `${getPercentage(value[1])}%` }}
          onMouseDown={(e) => handleMouseDown(e, "max")}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 1.15 }}
        />
      </div>
    </div>
  );
}

// Star Rating Component
interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
  showValue?: boolean;
}

export function StarRating({
  value,
  onChange,
  size = "md",
  readonly = false,
  showValue = false,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const displayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHoverValue(star)}
          onMouseLeave={() => setHoverValue(null)}
          whileHover={readonly ? undefined : { scale: 1.1 }}
          whileTap={readonly ? undefined : { scale: 0.95 }}
          className={cn(
            "transition-colors",
            readonly ? "cursor-default" : "cursor-pointer"
          )}
        >
          <svg
            className={cn(
              sizeClasses[size],
              star <= displayValue
                ? "text-amber-400 fill-amber-400"
                : "text-muted fill-muted"
            )}
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </motion.button>
      ))}
      {showValue && (
        <span className="ml-1 text-sm text-muted-foreground">
          ({value.toFixed(1)})
        </span>
      )}
    </div>
  );
}

// Animated Counter
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function AnimatedCounter({
  value,
  duration = 1,
  className,
  prefix = "",
  suffix = "",
}: AnimatedCounterProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    const controls = animate(count, value, { duration });
    
    const unsubscribe = rounded.on("change", (v) => {
      setDisplayValue(v);
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [count, value, duration, rounded]);

  return (
    <span className={className}>
      {prefix}
      {displayValue.toLocaleString('en-US')}
      {suffix}
    </span>
  );
}

// Progress Bar
interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  variant?: "default" | "success" | "warning" | "destructive";
}

export function Progress({
  value,
  max = 100,
  className,
  showLabel = false,
  variant = "default",
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const variantClasses = {
    default: "bg-primary",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    destructive: "bg-red-500",
  };

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between mb-1 text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", variantClasses[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// Skeleton Loader
interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
}

export function Skeleton({ className, variant = "rectangular" }: SkeletonProps) {
  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-xl",
  };

  return (
    <div
      className={cn(
        "bg-muted animate-pulse",
        variantClasses[variant],
        className
      )}
    />
  );
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
}
