import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";


export default function RecommendationPreview({
  recommendations = []
}) {

  return (
    <div
      className="
      rounded-3xl
      border border-border
      bg-surface
      p-6
      shadow-soft
      "
    >

      <div className="flex items-start justify-between">

        <div className="flex gap-3">

          <div
            className="
            flex h-11 w-11
            items-center justify-center
            rounded-2xl
            bg-primary/10
            "
          >
            <Sparkles
              className="text-primary"
              size={22}
            />
          </div>


          <div>

            <h2 className="font-bold text-ink">
              AI Recommendations
            </h2>

            <p className="text-sm text-muted">
              Based on your skills and goals
            </p>

          </div>

        </div>

      </div>



      <div className="mt-6 space-y-3">

        {
          recommendations.map((item,index)=>(
            
            <div
              key={index}
              className="
              rounded-2xl
              border border-border
              p-4
              transition
              hover:border-primary/40
              "
            >

              <div className="flex items-start justify-between">


                <div>

                  <h3 className="font-semibold text-ink">
                    {item}
                  </h3>


                  <p className="mt-1 text-sm text-muted">
                    Recommended based on your skill gap
                  </p>

                </div>



                <div
                  className="
                  flex items-center gap-1
                  rounded-full
                  bg-emerald-100
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  text-emerald-700
                  "
                >

                  <TrendingUp size={12}/>

                  AI

                </div>


              </div>


            </div>

          ))
        }


      </div>




      <Link
        to="/dashboard/recommendations"
        className="
        mt-6
        inline-flex
        items-center
        gap-2
        text-sm
        font-semibold
        text-primary
        hover:underline
        "
      >

        Explore recommendations

        <ArrowRight size={16}/>

      </Link>


    </div>
  );
}