import logoLight from "../../assets/logos/logo.png";
import logoDark from "../../assets/logos/logo-dark.png";

/*
| SkillSyncAI logo in the brand blue -> violet colors.
| Shows the navy-lettered version in light mode and the light-lettered
| version in dark mode (the navy "SkillSync" is unreadable on dark).
| Pass the same sizing classes you'd give an <img>.
*/
export default function BrandLogo({ className = "h-10 w-auto max-w-[170px]", alt = "SkillSyncAI" }) {
  return (
    <>
      <img src={logoLight} alt={alt} className={`object-contain dark:hidden ${className}`} />
      <img src={logoDark} alt={alt} className={`hidden object-contain dark:block ${className}`} />
    </>
  );
}
