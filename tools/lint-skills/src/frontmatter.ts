import type { TextFile } from "./types.ts";

export type Frontmatter =
  | { ok: true; fields: Map<string, { value: string; line: number }> }
  | { ok: false; line: number; message: string };

const FIELD = /^([A-Za-z][\w-]*):[ \t]*(.*)$/;

// A strict subset of YAML: single-line `key: value` pairs between two `---`
// lines. Multi-line values are rejected so a description always fits one line.
export function parseFrontmatter(file: TextFile): Frontmatter {
  if (file.lines[0] !== "---") {
    return { ok: false, line: 1, message: "file must start with a --- frontmatter block" };
  }
  const close = file.lines.indexOf("---", 1);
  if (close === -1) {
    return { ok: false, line: 1, message: "frontmatter is never closed (expected a closing ---)" };
  }
  const fields = new Map<string, { value: string; line: number }>();
  for (let i = 1; i < close; i++) {
    const m = FIELD.exec(file.lines[i]);
    if (!m) {
      return { ok: false, line: i + 1, message: "frontmatter lines must be single-line `key: value` pairs" };
    }
    fields.set(m[1], { value: m[2].trim(), line: i + 1 });
  }
  return { ok: true, fields };
}
