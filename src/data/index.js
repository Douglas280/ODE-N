import { STATES_PHRASES }   from "./states.js";
import { PATTERNS_PHRASES } from "./patterns.js";
import { IDENTITY_PHRASES } from "./identity.js";
import { EVENTS_PHRASES }   from "./events.js";
import { LANGUAGE_PHRASES } from "./language.js";

export const CATEGORY_DEFS = [
  { key: "states",   label: "states",   short: "states",   phrases: STATES_PHRASES   },
  { key: "patterns", label: "patterns", short: "patterns", phrases: PATTERNS_PHRASES },
  { key: "identity", label: "identity", short: "identity", phrases: IDENTITY_PHRASES },
  { key: "events",   label: "events",   short: "events",   phrases: EVENTS_PHRASES   },
  { key: "language", label: "language", short: "language", phrases: LANGUAGE_PHRASES },
];

export const CATEGORIES = CATEGORY_DEFS.map(c => ({ label: c.label, short: c.short }));
