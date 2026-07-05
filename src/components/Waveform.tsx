export function Waveform({
  size = "md",
  tone = "signal",
  animated = true,
}: {
  size?: "sm" | "md" | "lg";
  tone?: "signal" | "synth" | "muted";
  animated?: boolean;
}) {
  const heights =
    size === "lg"
      ? ["h-6", "h-10", "h-14", "h-8", "h-5"]
      : size === "md"
      ? ["h-3", "h-5", "h-7", "h-4", "h-2.5"]
      : ["h-1.5", "h-2.5", "h-3.5", "h-2", "h-1"];

  const color =
    tone === "signal" ? "bg-signal" : tone === "synth" ? "bg-synth" : "bg-muted";

  const anims = ["animate-wave1", "animate-wave2", "animate-wave3", "animate-wave4", "animate-wave5"];

  return (
    <div className="flex items-center gap-1" aria-hidden="true">
      {heights.map((h, i) => (
        <span
          key={i}
          className={`w-1 rounded-full ${h} ${color} ${animated ? anims[i] : ""}`}
          style={{ transformOrigin: "center" }}
        />
      ))}
    </div>
  );
}
