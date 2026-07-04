const GRADIENTS = [
  "from-[#5B4BFF] to-[#7A5CFF]",
  "from-[#FF6B6B] to-[#FFA36B]",
  "from-[#06B6D4] to-[#3B82F6]",
  "from-[#10B981] to-[#34D399]",
  "from-[#F59E0B] to-[#F97316]",
];

function getInitials(firstName = "", lastName = "") {
  const first = firstName.trim().charAt(0).toUpperCase();
  const last = lastName.trim().charAt(0).toUpperCase();
  return `${first}${last}` || "?";
}

function getGradient(seed = "") {
  const index =
    seed.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % GRADIENTS.length;
  return GRADIENTS[index];
}

const sizes = {
  sm: "h-10 w-10 text-sm",
  md: "h-16 w-16 text-xl",
  lg: "h-24 w-24 text-3xl",
};

export default function Avatar({ firstName, lastName, size = "md", className = "" }) {
  const initials = getInitials(firstName, lastName);
  const gradient = getGradient(`${firstName}${lastName}`);

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white shadow-soft ${gradient} ${sizes[size]} ${className}`}
    >
      {initials}
    </div>
  );
}