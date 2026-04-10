interface SkeletonProps {
  className?: string;
}

function SkeletonLine({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`bg-white/10 rounded-lg animate-pulse ${className}`}
    />
  );
}

export function TeamCardSkeleton() {
  return (
    <div className="bg-navy-800 border border-white/10 rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <SkeletonLine className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <SkeletonLine className="h-5 w-2/3" />
          <SkeletonLine className="h-3 w-1/3" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <SkeletonLine className="h-14 rounded-xl" />
        <SkeletonLine className="h-14 rounded-xl" />
        <SkeletonLine className="h-14 rounded-xl" />
      </div>
      <div className="space-y-2">
        <SkeletonLine className="h-3 w-full" />
        <SkeletonLine className="h-3 w-5/6" />
        <SkeletonLine className="h-3 w-4/6" />
        <SkeletonLine className="h-3 w-full" />
        <SkeletonLine className="h-3 w-3/4" />
      </div>
    </div>
  );
}

export function MatchupCardSkeleton() {
  return (
    <div className="bg-navy-700 border-2 border-accent-red/30 rounded-2xl p-6 space-y-4">
      <SkeletonLine className="h-6 w-1/2 mx-auto" />
      <SkeletonLine className="h-10 rounded-xl" />
      <div className="space-y-2">
        <SkeletonLine className="h-3 w-full" />
        <SkeletonLine className="h-3 w-5/6" />
        <SkeletonLine className="h-3 w-4/6" />
      </div>
      <SkeletonLine className="h-24 rounded-xl" />
    </div>
  );
}
