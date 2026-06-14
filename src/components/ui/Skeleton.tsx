interface SkeletonProps { className?: string; }

export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}

export function MovieCardSkeleton() {
  return (
    <div className="flex flex-col gap-2.5 animate-fade-up">
      <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
      <Skeleton className="h-3.5 w-4/5 rounded-md" />
      <Skeleton className="h-3 w-1/3 rounded-md" />
    </div>
  );
}
