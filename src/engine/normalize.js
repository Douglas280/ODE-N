export function normalize(raw) {
  return String(raw ?? "")
    .toLowerCase()
    .replace(/[^a-z ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function letterCount(norm) {
  return norm.replace(/ /g, "").length;
}

export function wordCount(norm) {
  return norm ? norm.split(" ").length : 0;
}

export function digitalRoot(n) {
  if (n === 0) return 0;
  const r = Math.abs(n) % 9;
  return r === 0 ? 9 : r;
}
