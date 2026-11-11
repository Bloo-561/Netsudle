// Classic mode columns. To add or remove a category, edit this list.
//   type "exact"  - green when equal
//   type "set"    - green when the lists are the same, yellow when they share an entry
//   type "number" - green when equal, otherwise an arrow towards the answer
export const COLUMNS = [
  { key: "gender", label: "Gender", type: "exact" },
  { key: "region", label: "Region", type: "exact" },
  { key: "group", label: "Group", type: "exact" },
  { key: "weapons", label: "Weapon", type: "set" },
  { key: "affiliations", label: "Affiliation", type: "set" },
  { key: "age", label: "Age", type: "number" },
  {
    key: "debut",
    label: "Debut",
    type: "exact",
    format: (v) => (v === 1 ? "Season I" : "Season II"),
    hideWhenSeason1Only: true,
  },
];

export const columnsFor = (season1Only) =>
  COLUMNS.filter((c) => !(season1Only && c.hideWhenSeason1Only));

const norm = (v) => String(v).trim().toLowerCase();

export function compare(col, guess, answer) {
  const g = guess[col.key];
  const a = answer[col.key];
  const text = col.format ? col.format(g) : Array.isArray(g) ? g.join(", ") : String(g);

  if (col.type === "set") {
    const gs = new Set(g.map(norm));
    const as = new Set(a.map(norm));
    const shared = [...gs].filter((x) => as.has(x)).length;
    const status =
      shared === gs.size && shared === as.size ? "match" : shared > 0 ? "partial" : "miss";
    return { status, text, arrow: null };
  }

  if (col.type === "number") {
    const gn = parseInt(g, 10);
    const an = parseInt(a, 10);
    if (Number.isNaN(gn) || Number.isNaN(an)) {
      return { status: norm(g) === norm(a) ? "match" : "miss", text, arrow: null };
    }
    if (gn === an) return { status: "match", text, arrow: null };
    return { status: "miss", text, arrow: gn < an ? "up" : "down" };
  }

  return { status: norm(g) === norm(a) ? "match" : "miss", text, arrow: null };
}
