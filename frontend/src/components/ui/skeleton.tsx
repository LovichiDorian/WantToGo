import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-muted/60",
        "relative overflow-hidden",
        // Shimmer effect
        "after:absolute after:inset-0",
        "after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent",
        "after:animate-[shimmer_2s_infinite]",
        className
      )}
      {...props}
    />
  )
}

// Card skeleton with realistic content
function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("glass-card space-y-4", className)}>
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-2xl" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  )
}

// Place card skeleton
function PlaceCardSkeleton() {
  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex gap-4">
        <Skeleton className="h-20 w-20 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Profile header skeleton
function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="gradient-hero rounded-3xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-16 w-16 rounded-full bg-white/20" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32 bg-white/20" />
            <Skeleton className="h-4 w-24 bg-white/20" />
          </div>
        </div>
        <div className="bg-white/10 rounded-2xl p-4 space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-8 w-20 bg-white/20" />
            <Skeleton className="h-8 w-12 bg-white/20 rounded-full" />
          </div>
          <Skeleton className="h-2 w-full bg-white/20 rounded-full" />
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

// Leaderboard skeleton
function LeaderboardSkeleton() {
  return (
    <div className="space-y-4">
      {/* Podium */}
      <div className="flex justify-center items-end gap-2 h-40">
        <Skeleton className="w-24 h-20 rounded-t-xl" />
        <Skeleton className="w-28 h-28 rounded-t-xl" />
        <Skeleton className="w-24 h-16 rounded-t-xl" />
      </div>
      {/* List */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="glass-card p-3 flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-5 w-16" />
        </div>
      ))}
    </div>
  )
}

// Quest card skeleton
function QuestSkeleton() {
  return (
    <div className="glass-card p-4 flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-1.5 w-full rounded-full" />
      </div>
      <Skeleton className="h-5 w-5 rounded" />
    </div>
  )
}

// Map placeholder skeleton
function MapSkeleton() {
  return (
    <div className="relative w-full h-full bg-muted/30 overflow-hidden">
      {/* Fake map grid */}
      <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-px opacity-20">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="bg-muted" />
        ))}
      </div>
      {/* Fake pins */}
      {[
        { top: '30%', left: '40%' },
        { top: '50%', left: '60%' },
        { top: '70%', left: '35%' },
      ].map((pos, i) => (
        <Skeleton
          key={i}
          className="absolute w-8 h-8 rounded-full"
          style={pos}
        />
      ))}
      {/* Center loading */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="glass-strong rounded-2xl p-6 text-center">
          <Skeleton className="h-10 w-10 rounded-full mx-auto mb-3" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </div>
  )
}

export { 
  Skeleton, 
  CardSkeleton, 
  PlaceCardSkeleton, 
  ProfileSkeleton, 
  LeaderboardSkeleton,
  QuestSkeleton,
  MapSkeleton
}
