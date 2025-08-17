type GridSkeletonProps = { count?: number; colsDesktop?: string; colsMobile?: string }

export const GridSkeleton = ({ count = 12, colsDesktop = 'grid-cols-6', colsMobile = 'grid-cols-2' }: GridSkeletonProps) => (
  <>
    <div className={`hidden md:grid ${colsDesktop} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-48 rounded-xl bg-purplefy-dark/40 animate-pulse" />
      ))}
    </div>
    <div className={`grid md:hidden ${colsMobile} gap-3`}>
      {Array.from({ length: Math.min(count, 6) }).map((_, i) => (
        <div key={i} className="h-40 rounded-xl bg-purplefy-dark/40 animate-pulse" />
      ))}
    </div>
  </>
)
