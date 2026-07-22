import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Briefcase,
  Sparkles,
  Settings,
} from "lucide-react";


const navItems = [
  {
    to:"/dashboard",
    label:"Home",
    icon:LayoutDashboard,
    end:true,
  },
  {
    to:"/dashboard/profile",
    label:"Profile",
    icon:User,
  },
  {
    to:"/dashboard/jobs",
    label:"Jobs",
    icon:Briefcase,
  },
  {
    to:"/dashboard/recommendations",
    label:"Skills",
    icon:Sparkles,
  },
  {
    to:"/dashboard/settings",
    label:"Settings",
    icon:Settings,
  },
];


export default function DashboardMobileNav(){

return(

<nav className="
flex gap-2 overflow-x-auto
border-b border-border
bg-surface-alt
px-4 py-3
sm:hidden
">

{navItems.map(
({to,label,icon:Icon,end})=>(

<NavLink
key={to}
to={to}
end={end}
className={({isActive})=>
`
flex shrink-0 items-center gap-2
rounded-xl px-3 py-2 text-sm

${
isActive
?
"bg-primary text-white"
:
"text-ink/70"
}

`
}
>

<Icon className="h-4 w-4"/>

{label}

</NavLink>

)

)}

</nav>

);

}