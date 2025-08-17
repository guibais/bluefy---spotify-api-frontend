export const DetailSkeleton = () => (
  <div className="flex flex-col md:flex-row gap-8 mb-8">
    <div className="skeleton w-24 h-24 md:w-80 md:aspect-square rounded-xl" />
    <div className="flex-1 space-y-4">
      <div className="skeleton h-12 w-3/4" />
      <div className="skeleton h-6 w-1/2" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-2/3" />
    </div>
  </div>
)
