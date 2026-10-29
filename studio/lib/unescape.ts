// Reverses validator.escape, which the app applies to form input before saving it.
// &amp; must be replaced last, so "&amp;quot;" becomes "&quot;" and not '"'.
export const unescapeHtml = (value: string) =>
  value
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x2F;/g, "/")
    .replace(/&#x5C;/g, "\\")
    .replace(/&#96;/g, "`")
    .replace(/&amp;/g, "&");
