import type { Rule } from "../types.ts";

const REFERENCE = /\b(?:references|scripts|assets)\/[\w./-]*\w/g;

export const skillFile: Rule = (repo) =>
  repo.skills
    .filter((s) => !s.skillFile)
    .map((s) => ({ path: `skills/${s.dir}`, line: 1, rule: "skill-file", message: "skill directory has no SKILL.md" }));

export const referenceMissing: Rule = (repo) =>
  repo.skills.flatMap((s) => {
    const file = s.skillFile;
    if (!file) return [];
    return file.lines.flatMap((text, i) =>
      [...text.matchAll(REFERENCE)]
        .filter((m) => !s.files.includes(m[0]))
        .map((m) => ({
          path: file.path,
          line: i + 1,
          rule: "reference-missing",
          message: `${m[0]} does not exist in skills/${s.dir}`,
        })),
    );
  });
