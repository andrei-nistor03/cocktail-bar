/** Renders text as one inline-block span per character, for letter animations. */
export function SplitChars({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((char, index) => (
        <span key={index} aria-hidden="true" className="inline-block">
          {char === " " ? " " : char}
        </span>
      ))}
      <span className="sr-only">{text}</span>
    </>
  );
}

/** Same as SplitChars but per word, so long copy can still wrap naturally. */
export function SplitWords({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, index) => (
        <span
          key={index}
          aria-hidden="true"
          className="inline-block whitespace-nowrap mr-1"
        >
          {word}
        </span>
      ))}
      <span className="sr-only">{text}</span>
    </>
  );
}
