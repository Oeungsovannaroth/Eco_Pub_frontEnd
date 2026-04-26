function LedBar({ messages }) {
  const text =
    messages.length > 0
      ? messages.map((item) => item.message).join(" • ")
      : "Welcome to Pub House — enjoy food, drinks, and live events.";

  return (
    <div className="overflow-hidden bg-red-500 py-4 text-white mt-0.5">
      <div className="animate-marquee whitespace-nowrap px-4 text-md font-medium">
        {text}
      </div>
    </div>
  );
}

export default LedBar;