// components/RecommendationCard.tsx
interface RecommendationCardProps {
  course: { id: string; title: string; level: string; price: number; thumbnailUrl?: string };
}

export default function RecommendationCard({ course }: RecommendationCardProps) {
  return (
    <div className="p-4 border rounded-xl hover:shadow-md transition-all cursor-pointer">
      <h4 className="font-medium text-slate-900 truncate mb-2 text-sm">{course.title}</h4>
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 capitalize">{course.level}</span>
        <span className="font-bold text-emerald-600">₹{course.price}</span>
      </div>
    </div>
  );
}
