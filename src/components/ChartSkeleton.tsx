function ChartSkeletonCard() {
  return (
    <div className="rounded-xl bg-white p-4 shadow-md dark:bg-gray-800">
      {/* Title placeholder */}
      <div className="mb-4 h-6 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />

      {/* Chart area */}
      <div className="relative h-64">
        {/* Y-axis tick placeholders */}
        <div className="absolute left-0 top-0 flex h-full flex-col justify-between py-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-3 w-8 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          ))}
        </div>

        {/* Grid area */}
        <div className="ml-10 flex h-full flex-col justify-between py-2">
          {/* Horizontal grid lines */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-px w-full bg-gray-200 dark:bg-gray-700" />
          ))}
        </div>

        {/* Pulse bars representing data lines */}
        <div className="absolute inset-0 ml-10 flex items-center gap-2 px-4">
          <div className="h-24 flex-1 animate-pulse rounded bg-blue-200 opacity-30 dark:bg-blue-800" />
          <div className="h-20 flex-1 animate-pulse rounded bg-red-200 opacity-30 dark:bg-red-800" />
        </div>

        {/* X-axis label placeholders */}
        <div className="absolute bottom-0 left-10 right-0 flex justify-between px-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-3 w-10 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ChartSkeletonGrid() {
  return (
    <div>
      {/* Header placeholder: location names + "vs" */}
      <div className="mb-6 flex items-center justify-center gap-3">
        <div className="h-8 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-6 w-8 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-8 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Chart grid matching ComparisonDashboard layout */}
      <div className="grid gap-6 md:grid-cols-2">
        <ChartSkeletonCard />
        <ChartSkeletonCard />
        <ChartSkeletonCard />
        <ChartSkeletonCard />

        {/* Insights panel skeleton */}
        <div className="rounded-xl bg-white p-4 shadow-md dark:bg-gray-800 md:col-span-2">
          <div className="mb-4 h-6 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="h-8 w-8 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1 space-y-1">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
