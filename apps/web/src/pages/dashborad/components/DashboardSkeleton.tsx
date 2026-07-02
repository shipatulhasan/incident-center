import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <section className="space-y-8">
      {/* Search */}
      <div className="flex gap-4">
        <Skeleton className="h-11 flex-1 bg-slate-200" />
        <Skeleton className="h-11 w-44 bg-slate-200" />
      </div>

      {/* Metrics */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-36 rounded-xl bg-slate-200"
          />
        ))}
      </div>

      {/* Kanban */}
      <div className="grid gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, column) => (
          <div
            key={column}
            className="space-y-4 rounded-xl border p-5"
          >
            <Skeleton className="h-6 w-36 bg-slate-200" />

            {Array.from({ length: 3 }).map((_, card) => (
              <Skeleton
                key={card}
                className="h-40 rounded-xl bg-slate-200"
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}