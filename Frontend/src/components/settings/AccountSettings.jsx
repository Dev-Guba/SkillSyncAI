import { User } from "lucide-react";


export default function AccountSettings({user}) {

    return (

        <div className="
            rounded-2xl
            border
            border-border
            bg-surface
            p-6
            shadow-sm
        ">

            <div className="flex items-center gap-3 mb-5">

                <User className="text-primary"/>

                <h3 className="font-semibold text-ink">
                    Account Information
                </h3>

            </div>


            <div className="space-y-3 text-sm">


                <div>
                    <p className="text-muted">
                        Username
                    </p>

                    <p className="font-medium text-ink">
                        {user?.username}
                    </p>
                </div>


                <div>
                    <p className="text-muted">
                        Account Role
                    </p>

                    <p className="font-medium text-ink">
                        {user?.Role?.role_name ?? "Student"}
                    </p>
                </div>


            </div>


        </div>

    );
}