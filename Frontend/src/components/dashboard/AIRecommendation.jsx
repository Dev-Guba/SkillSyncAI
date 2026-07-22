import { Sparkles } from "lucide-react";


export default function AIRecommendation() {
  return (
<div className="
  rounded-2xl
  border
  border-primary/20
  bg-primary/10
  p-6
">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />

        <h2 className="font-semibold">
          AI Recommendation
        </h2>
      </div>


      <p className="mt-4 text-sm leading-relaxed text-ink">
        Based on current market trends, learning TypeScript
        and advanced React patterns can improve your chances
        of qualifying for frontend developer roles.
      </p>
    </div>
  );
}