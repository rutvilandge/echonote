export default function EmptyState({ text }: { text: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "200px",
        color: "#888",
        fontSize: "14px",
      }}
    >
      {text}
    </div>
  );
}