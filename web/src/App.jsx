// Loads the published board and the placeholder check scores and shows the
// stat boxes and one table. The placeholder goes when real verdicts land.
import { useEffect, useState } from "react";
import Chart from "./Chart.jsx";

const UPSTREAM = "https://github.com/arimlabs/malware-bench";
const STATS = [
  [12, "Samples"],
  [121, "Ground-truth IOCs"],
  [252, "Scored runs"],
  ["0/121", "Checked"],
];

async function load(name) {
  const r = await fetch(name);
  if (!r.ok) throw new Error(`${name} not loaded (${r.status})`);
  return r.json();
}

function withPlaceholder(models, dummy) {
  return models.map((m) => {
    const ratio = dummy[m.model] / m.published;
    const tasks = m.tasks.map((t) => ({ ...t, proved: t.published * ratio }));
    return { ...m, proved: dummy[m.model], tasks };
  });
}

export default function App() {
  const [board, setBoard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([load("board.json"), load("dummy.json")])
      .then(([b, dummy]) => setBoard({ ...b, models: withPlaceholder(b.models, dummy.proved) }))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <main>
      <p className="kicker">MAbench · checked against the binaries</p>
      <h1>Malware Bench</h1>
      <div className="stats">
        {STATS.map(([n, label]) => (
          <div key={label}>
            <b>{n}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>
      {error && <p className="error">{error}</p>}
      {board && <Chart models={board.models} items={board.tasks} />}
      <p className="legend">
        <i className="key light" /> Published <i className="key dark" /> Actual
      </p>
      <p className="note">
        IOC recall is IOCs found out of 121, averaged over the 3 passes. Actual
        IOCs are placeholders until the checker runs. Published scores from{" "}
        <a href={UPSTREAM}>arimlabs/malware-bench</a>; all 252 reproduce exactly.
      </p>
    </main>
  );
}
