import { SkeletonLine } from "@/components/Skeleton";

export default function MeetingLoading() {
  return (
    <div>
      <div className="mb-8 space-y-2">
        <SkeletonLine width="80px" />
        <div className="h-9 w-72 rounded skeleton animate-shimmer" />
        <SkeletonLine width="140px" />
      </div>
      <div className="flex gap-4 border-b border-ink-line mb-6 pb-3">
        <SkeletonLine width="70px" />
        <SkeletonLine width="70px" />
        <SkeletonLine width="70px" />
      </div>
      <div className="h-64 rounded-xl skeleton animate-shimmer" />
    </div>
  );
}
