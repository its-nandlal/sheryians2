// components/DashboardSkeleton.tsx
export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="h-12 w-64 bg-slate-200 animate-pulse rounded-lg mb-8" />
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-200 animate-pulse rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-slate-200 animate-pulse rounded-xl" />
        ))}
      </div>
    </div>
  );
}
