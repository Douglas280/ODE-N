import { STATES_PHRASES }   from "./states.js";
import { PATTERNS_PHRASES } from "./patterns.js";
import { IDENTITY_PHRASES } from "./identity.js";
import { EVENTS_PHRASES }   from "./events.js";
import { LANGUAGE_PHRASES } from "./language.js";

export const CATEGORY_DEFS = [
  { key: "states",   label: "States",   phrases: STATES_PHRASES   },
  { key: "patterns", label: "Patterns", phrases: PATTERNS_PHRASES },
  { key: "identity", label: "Identity", phrases: IDENTITY_PHRASES },
  { key: "events",   label: "Events",   phrases: EVENTS_PHRASES   },
  { key: "language", label: "Language", phrases: LANGUAGE_PHRASES },
];

export const CATEGORIES = CATEGORY_DEFS.map(c => c.key);
