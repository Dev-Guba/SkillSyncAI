export default function ProgressBar({ value = 0 }) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-border">
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#5B4BFF] to-[#7A5CFF] transition-all"
        style={{
          width: `${value}%`,
        }}
      />
    </div>
  );
}