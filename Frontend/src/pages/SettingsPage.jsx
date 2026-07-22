import { useState } from "react";

import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuth } from "@/context/AuthContext";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileInfoGrid from "@/components/profile/ProfileInfoGrid";
import EditProfileModal from "@/components/profile/EditProfileModal";

import ThemeSettings from "@/components/settings/ThemeSettings";
import AccountSettings from "@/components/settings/AccountSettings";
import DangerZone from "@/components/settings/DangerZone";


export default function SettingsPage() {


const {profile, updateProfile, isSaving}=useUserProfile();

const {user}=useAuth();


const [isEditOpen,setIsEditOpen]=useState(false);



return (

<section className="
mx-auto
max-w-5xl
space-y-8
px-4
py-10
sm:px-6
">


<div>

<h1 className="
text-3xl
font-bold
text-ink
">
Settings
</h1>

<p className="text-muted mt-2">
Manage your profile and preferences
</p>

</div>



{/* PROFILE */}

<div className="space-y-5">

<ProfileHeader
profile={profile}
onEdit={()=>setIsEditOpen(true)}
/>


<ProfileInfoGrid
profile={profile}
/>


</div>



{/* APPEARANCE */}

<ThemeSettings />



{/* ACCOUNT */}

<AccountSettings user={user}/>



{/* DANGER */}

<DangerZone />




<EditProfileModal

profile={profile}

isOpen={isEditOpen}

onClose={()=>setIsEditOpen(false)}

onSave={updateProfile}

isSaving={isSaving}

/>



</section>

)

}