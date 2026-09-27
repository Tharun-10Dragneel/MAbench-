// One table row: rank, model, published and actual recall, a bar whose pale
// end is the difference, published and actual IOCs, and cost per run.
const ORG = {
  "claude-opus-5": "Anthropic",
  "gpt-5.6-sol": "OpenAI",
  "kimi-k3": "Moonshot",
  "glm-5.2": "Zhipu",
  "grok-4.5": "xAI",
  "gemini-3.6-flash": "Google",
  "qwen3.7-max": "Alibaba",
};

function count(percent, total) {
  return Math.round((percent * total) / 100);
}

export default function Row({ rank, label, published, proved, total, cost, open, onClick }) {
  const gap = published - proved;
  const Tag = onClick ? "button" : "div";
  return (
    <Tag className={onClick ? "row" : "row task"} onClick={onClick} aria-expanded={open}>
      <span className={rank === 1 ? "rank first" : "rank"}>
        {rank ? String(rank).padStart(2, "0") : ""}
      </span>
      <span className="model">
        {label} <small>{ORG[label]}</small>
      </span>
      <span className="score">
        {published.toFixed(1)}
        <small>%</small>
      </span>
      <span className="score actual">
        {proved.toFixed(1)}
        <small>%</small>
      </span>
      <span className="bar">
        <span className="track">
          <span className="fill" style={{ width: `${proved}%` }} />
          <span className="gap" style={{ width: `${gap}%` }} />
        </span>
        <span className="minus">−{gap.toFixed(1)}</span>
      </span>
      <span className="iocs">
        {count(published, total)}
        <small>/{total}</small>
      </span>
      <span className="iocs actual">
        {count(proved, total)}
        <small>/{total}</small>
      </span>
      <span className="iocs">{cost == null ? "–" : `$${cost.toFixed(2)}`}</span>
    </Tag>
  );
}
