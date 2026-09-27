// The leaderboard table. Headers sort like a spreadsheet; a model row opens
// its twelve tasks underneath.
import { useState } from "react";
import Row from "./Row.jsx";

const SORTS = {
  Model: (a, b) => a.model.localeCompare(b.model),
  "Published recall": (a, b) => b.published - a.published,
  "Actual recall": (a, b) => b.proved - a.proved,
  Gap: (a, b) => b.published - b.proved - (a.published - a.proved),
};

function Model({ m, rank, items }) {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);
  return (
    <>
      <Row rank={rank} label={m.model} published={m.published} proved={m.proved} total={121} cost={m.cost} open={open} onClick={toggle} />
      {open &&
        m.tasks.map((t) => (
          <Row key={t.task} label={t.task} published={t.published} proved={t.proved} total={items[t.task].items} cost={t.cost} />
        ))}
    </>
  );
}

function Sort({ name, sort, setSort }) {
  const on = name === sort;
  return (
    <button className={on ? "on" : ""} onClick={() => setSort(name)}>
      {name}
      {on ? " ↓" : ""}
    </button>
  );
}

export default function Chart({ models, items }) {
  const [sort, setSort] = useState("Published recall");
  const ranked = [...models].sort(SORTS["Published recall"]).map((m) => m.model);
  const rows = [...models].sort(SORTS[sort]);
  const props = { sort, setSort };
  return (
    <section>
      <div className="row head">
        <span>#</span>
        <Sort name="Model" {...props} />
        <Sort name="Published recall" {...props} />
        <Sort name="Actual recall" {...props} />
        <Sort name="Gap" {...props} />
        <span className="iocs">Published IOCs</span>
        <span className="iocs">Actual IOCs</span>
        <span className="iocs">$/run</span>
      </div>
      {rows.map((m) => (
        <Model key={m.model} m={m} items={items} rank={ranked.indexOf(m.model) + 1} />
      ))}
    </section>
  );
}
