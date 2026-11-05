import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function DangerZone() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="font-bold text-gray-900 dark:text-gray-100">
                Account Session
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Manage your active session
            </p>

            <div className="mt-5">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </div>
    );
}