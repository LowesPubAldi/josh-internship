const LATIN_PLACEHOLDER_PATTERNS = [
  /\bsed\s+ut\s+perspiciatis\b/i,
  /\bunde\s+omnis\s+iste\s+natus\b/i,
  /\blorem\s+ipsum\b/i,
  /\bdolor\s+sit\s+amet\b/i,
  /\baccusantium\s+doloremque\b/i,
  /\bea(que)?\s+ipsa\s+quae\b/i,
  /\bveritatis\s+et\s+quasi\b/i,
  /\bbeatae\s+vitae\s+dicta\b/i,
];

const buildEnglishFallback = (item = {}) => {
  const itemName = item.title || "This collectible";
  return `${itemName} features bold abstract style, high contrast color, and a modern visual identity built for serious NFT collectors.`;
};

export const ensureEnglishDescription = (description, item = {}) => {
  const normalized = typeof description === "string" ? description.trim() : "";

  if (!normalized) {
    return buildEnglishFallback(item);
  }

  const hasLatinPlaceholder = LATIN_PLACEHOLDER_PATTERNS.some((pattern) =>
    pattern.test(normalized)
  );

  return hasLatinPlaceholder ? buildEnglishFallback(item) : normalized;
};
