import { CheckCircle2 } from "lucide-react";
import logo from "../../assets/logos/logo.png";

const features = [
  "AI-powered career matching",
  "Smart skill recommendations",
  "Personalized career growth",
];

export default function AuthLeftPanel() {
  return (
    <div className="flex h-full w-full flex-col justify-between px-14 py-12">

      <div>

        <div className="flex items-center gap-4">
          <img
            src={logo}
            className="h-12 w-12"
            alt="SkillSyncAI"
          />

          <div>
            <h2 className="text-2xl font-bold">
              SkillSyncAI
            </h2>
          </div>
        </div>

        <div className="mt-24">

          <h1 className="text-6xl font-black leading-tight tracking-tight">

            AI that connects

            <br />

            your skills to

            <br />

            <span className="bg-gradient-to-r from-[#5B4BFF] to-[#7A5CFF] bg-clip-text text-transparent">
              the right opportunities.
            </span>

          </h1>

          <p className="mt-8 max-w-xl text-lg text-gray-500 leading-8">

            Discover careers tailored to your skills, interests,
            and potential with intelligent recommendations
            built specifically for students and professionals.

          </p>

          <div className="mt-12 space-y-5">

            {features.map((item) => (

              <div
                key={item}
                className="flex items-center gap-4"
              >

                <CheckCircle2
                  className="text-[#5B4BFF]"
                  size={24}
                />

                <span className="text-lg font-medium">
                  {item}
                </span>

              </div>

            ))}

          </div>

        </div>

      </div>

      <p className="text-sm text-gray-400">
        © 2026 SkillSyncAI
      </p>

    </div>
  );
}