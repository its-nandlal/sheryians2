export function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-1 h-6 bg-emerald-500 rounded-full" />
      <h2 className="text-lg font-[NeueMachina] font-semibold text-emerald-50">{title}</h2>
    </div>
  )
}
