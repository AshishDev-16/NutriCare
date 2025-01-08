export function DashboardSkeleton() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="h-9 w-[200px] rounded-md bg-muted animate-pulse" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 rounded-lg bg-muted animate-pulse h-[120px]" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-7">
        <div className="col-span-4 h-[400px] rounded-lg bg-muted animate-pulse" />
        <div className="col-span-3 h-[400px] rounded-lg bg-muted animate-pulse" />
      </div>
    </div>
  )
} 