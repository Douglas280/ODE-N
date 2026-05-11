// Vowels used in gematria ciphers — 'y' excluded (purely consonantal in these systems)
export const CIPHER_VOWELS = new Set(["a", "e", "i", "o", "u"]);

// Vowels used for name numerology — 'y' included as semi-vowel
export const NAME_VOWELS = new Set(["a", "e", "i", "o", "u", "y"]);

// Pythagorean reduction: A–Z → 1–9 repeating (classical numerology table)
export const PYTH_MAP = [1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8];

// First 26 primes: A=2, B=3, C=5, …
export const PRIME_MAP = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101];

export const RAINBOW = ["#ff4444","#ff8c00","#ffd700","#4ade80","#38bdf8","#818cf8","#c084fc"];

export const CIPHERS = {
  simple:        { key: "simple",        label: "Simple English", short: "SE", color: "#38bdf8" },
  reverseSimple: { key: "reverseSimple", label: "Reverse Simple", short: "RS", color: "#c084fc" },
  weighted:      { key: "weighted",      label: "Weighted",       short: "WG", color: "#f472b6" },
  ascii:         { key: "ascii",         label: "ASCII",          short: "AC", color: "#4ade80" },
  shadow:        { key: "shadow",        label: "Shadow",         short: "SH", color: "#fb923c" },
  eclipse:       { key: "eclipse",       label: "Eclipse",        short: "EC", color: "#e879f9" },
  pythagorean:   { key: "pythagorean",   label: "Pythagorean",    short: "PY", color: "#facc15" },
  prime:         { key: "prime",         label: "Prime",          short: "PR", color: "#2dd4bf" },
};

export const CIPHER_KEYS = [
  "simple", "reverseSimple", "weighted", "ascii",
  "shadow", "eclipse", "pythagorean", "prime",
];
