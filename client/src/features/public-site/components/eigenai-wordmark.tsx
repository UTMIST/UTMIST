type EigenAIWordmarkProps = {
  className?: string;
};

export function EigenAIWordmark({
  className = "",
}: EigenAIWordmarkProps) {
  return (
    <span
      data-testid="eigenai-wordmark"
      className={`eigenai-wordmark eigenai-serif ${className}`}
    >
      <span className="eigenai-wordmark__base">eigenai</span>
      <span aria-hidden="true" className="eigenai-wordmark__depth">
        eigenai
      </span>
      <span aria-hidden="true" className="eigenai-wordmark__shine">
        eigenai
      </span>
      <span aria-hidden="true" className="eigenai-wordmark__glint">
        eigenai
      </span>
    </span>
  );
}
