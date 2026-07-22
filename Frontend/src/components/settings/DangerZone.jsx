import { LogOut, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";


export default function DangerZone(){

    const { logout } = useAuth();
    const navigate = useNavigate();


    const handleLogout = () => {

        logout();

        navigate("/login");

    };


    return (

        <div
        className="
        rounded-2xl
        border
        border-red-300
        bg-red-50
        p-6
        dark:bg-red-950/20
        "
        >


            <h3
            className="
            font-bold
            text-red-600
            "
            >
                Danger Zone
            </h3>


            <p className="
            mt-2
            text-sm
            text-muted
            ">
                Manage account actions
            </p>



            <div className="
            mt-5
            flex
            flex-col
            gap-3
            ">



                <button
                onClick={handleLogout}
                className="
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-red-600
                px-4
                py-2
                font-medium
                text-white
                transition
                hover:bg-red-700
                "
                >

                    <LogOut size={18}/>

                    Logout

                </button>




                <button

                className="
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-red-400
                px-4
                py-2
                font-medium
                text-red-600
                transition
                hover:bg-red-100
                dark:hover:bg-red-900/30
                "

                >

                    <Trash2 size={18}/>

                    Delete Account

                </button>



            </div>


        </div>

    )

}