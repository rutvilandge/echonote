export function SkeletonLine({ width = "100%" }: { width?: string }) {
  return <div className="h-4 rounded skeleton animate-shimmer" style={{ width }} aria-hidden="true" />;
}

export function SkeletonCard() {
  return (
    <div className="border border-ink-line rounded-xl p-5 space-y-3">
      <SkeletonLine width="40%" />
      <SkeletonLine width="70%" />
      <SkeletonLine width="55%" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-ink-line">
      <div className="h-3 w-24 rounded skeleton animate-shimmer" aria-hidden="true" />
      <div className="h-3 flex-1 rounded skeleton animate-shimmer" aria-hidden="true" />
      <div className="h-3 w-16 rounded skeleton animate-shimmer" aria-hidden="true" />
    </div>
  );
}
