import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
}

export const SkeletonLoader = ({ className, variant = "rectangular" }: SkeletonLoaderProps) => {
  const baseClasses = "animate-pulse bg-muted relative overflow-hidden";
  
  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-xl",
  };

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)}>
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
    </div>
  );
};

export const CardSkeleton = () => (
  <div className="rounded-2xl border border-border p-6 space-y-4">
    <SkeletonLoader className="h-40 w-full" />
    <SkeletonLoader variant="text" className="w-3/4" />
    <SkeletonLoader variant="text" className="w-1/2" />
  </div>
);

export const TableRowSkeleton = () => (
  <div className="flex items-center gap-4 p-4 border-b border-border">
    <SkeletonLoader variant="circular" className="h-10 w-10" />
    <div className="flex-1 space-y-2">
      <SkeletonLoader variant="text" className="w-1/4" />
      <SkeletonLoader variant="text" className="w-1/2" />
    </div>
  </div>
);
