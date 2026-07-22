import { Moon, Sun } from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeSettings() {

    const { theme } = useTheme();

    return (
        <div className="
            rounded-2xl
            border
            border-border
            bg-surface
            p-6
            shadow-sm
        ">

            <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                    {theme === "dark" ? (
                        <Moon className="text-violet-500"/>
                    ) : (
                        <Sun className="text-amber-500"/>
                    )}

                    <div>
                        <h3 className="font-semibold text-ink">
                            Appearance
                        </h3>

                        <p className="text-sm text-muted">
                            Switch between light and dark mode
                        </p>
                    </div>

                </div>


                <ThemeToggle />

            </div>

        </div>
    );
}