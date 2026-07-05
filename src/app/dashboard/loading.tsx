import { SkeletonCard, SkeletonRow } from "@/components/Skeleton";

export default function DashboardLoading() {
  return (
    <div>
      <div className="flex items-end justify-between mb-10">
        <div className="space-y-2">
          <div className="h-3 w-16 rounded skeleton animate-shimmer" />
          <div className="h-8 w-48 rounded skeleton animate-shimmer" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <div className="border-t border-ink-line">
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
    </div>
  );
}
