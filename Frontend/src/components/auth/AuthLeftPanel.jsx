import { CheckCircle2 } from "lucide-react";
import logo from "../../assets/logos/logo.png";

const features = [
  "AI-powered career matching",
  "Smart skill recommendations",
  "Personalized career growth",
];

export default function AuthLeftPanel() {
  return (
    <div className="
      flex
      h-full
      w-full
      flex-col
      justify-center
      px-12
      xl:px-16
    ">

      {/* Brand */}
      <div className="absolute top-10">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            className="h-11 w-11 object-contain"
            alt="SkillSyncAI"
          />

          <h2 className="text-xl font-bold text-ink">
            SkillSyncAI
          </h2>
        </div>
      </div>


      {/* Main Content */}
      <div className="max-w-xl">

        <h1
          className="
            text-5xl
            xl:text-6xl
            font-black
            leading-[1.05]
            tracking-tight
            text-ink
          "
        >
          AI that connects
          <br />

          your skills to

          <br />

          <span className="
            bg-gradient-to-r 
            from-[#5B4BFF] 
            to-[#7A5CFF]
            bg-clip-text
            text-transparent
          ">
            better opportunities.
          </span>

        </h1>



        {/* Features */}

        <div className="mt-8 space-y-4">

          {features.map((item)=>(
            <div
              key={item}
              className="
                flex
                items-center
                gap-3
              "
            >

              <div className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-full
                bg-primary/10
              ">
                <CheckCircle2
                  size={17}
                  className="text-primary"
                />
              </div>


              <span className="
                text-base
                font-medium
                text-ink
              ">
                {item}
              </span>

            </div>
          ))}

        </div>

      </div>


      {/* Footer */}
      <p
        className="
          absolute
          bottom-10
          text-sm
          text-muted
        "
      >
        © 2026 SkillSyncAI
      </p>


    </div>
  );
}