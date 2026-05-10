import { digitalRoot } from "./normalize.js";
import { NAME_VOWELS } from "./constants.js";

export const NAME_COMPONENTS = [
  { key: "fullVal",      dr: "fullDR",      label: "Expression",  desc: "full name · all letters",    strKey: "full"       },
  { key: "vowelVal",     dr: "vowelDR",     label: "Soul Urge",   desc: "vowels only",                strKey: "vowels"     },
  { key: "consonantVal", dr: "consonantDR", label: "Personality", desc: "consonants only",            strKey: "consonants" },
  { key: "firstVal",     dr: "firstDR",     label: "First",       desc: "first name",                 strKey: "first"      },
  { key: "lastVal",      dr: "lastDR",      label: "Last",        desc: "last name",                  strKey: "last"       },
  { key: "initialsVal",  dr: "initialsDR",  label: "Initials",    desc: "first letter of each part",  strKey: "initials"   },
];

export const COMPONENT_COLORS = [
  "#38bdf8", "#c084fc", "#f472b6", "#4ade80", "#fb923c", "#e879f9",
];

function ordSum(s) {
  let t = 0;
  for (let i = 0; i < s.length; i++) {
    const cc = s.charCodeAt(i);
    if (cc >= 97 && cc <= 122) t += cc - 96;
  }
  return t;
}

export function parseName(raw) {
  const clean = raw.trim().toLowerCase().replace(/[^a-z ]/g, "").replace(/\s+/g, " ");
  const parts = clean.split(" ").filter(Boolean);
  if (!parts.length) return null;

  const first = parts[0] || "";
  const last  = parts.length > 1 ? parts[parts.length - 1] : "";
  const full  = parts.join("");

  let vowelStr = "", consonantStr = "";
  for (const ch of full) {
    if (NAME_VOWELS.has(ch)) vowelStr += ch;
    else consonantStr += ch;
  }

  const initialsStr  = parts.map(p => p[0]).join("");
  const firstVal     = ordSum(first);
  const lastVal      = ordSum(last);
  const fullVal      = ordSum(full);
  const vowelVal     = ordSum(vowelStr);
  const consonantVal = ordSum(consonantStr);
  const initialsVal  = ordSum(initialsStr);

  return {
    raw: raw.trim(),
    parts,
    first, last, full,
    vowels: vowelStr, consonants: consonantStr, initials: initialsStr,
    firstVal, lastVal, fullVal, vowelVal, consonantVal, initialsVal,
    firstDR:     digitalRoot(firstVal),
    lastDR:      digitalRoot(lastVal),
    fullDR:      digitalRoot(fullVal),
    vowelDR:     digitalRoot(vowelVal),
    consonantDR: digitalRoot(consonantVal),
    initialsDR:  digitalRoot(initialsVal),
  };
}
