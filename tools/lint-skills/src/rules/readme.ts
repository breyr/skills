import type { Rule, Violation } from "../types.ts";

const BULLET = /^- `([^`]+)`:/;

export const readmeSkills: Rule = (repo) => {
  const fail = (line: number, message: string): Violation => ({ path: "README.md", line, rule: "readme-skills", message });
  if (!repo.readme) return [fail(1, "README.md is missing")];
  const lines = repo.readme.lines;
  const start = lines.findIndex((l) => l === "## Skills");
  if (start === -1) return [fail(1, 'README.md has no "## Skills" section')];
  let end = lines.findIndex((l, i) => i > start && l.startsWith("## "));
  if (end === -1) end = lines.length;

  const listed = new Map<string, number>();
  for (let i = start + 1; i < end; i++) {
    const m = BULLET.exec(lines[i]);
    if (m) listed.set(m[1], i + 1);
  }
  const dirs = new Set(repo.skills.map((s) => s.dir));
  return [
    ...[...dirs].filter((d) => !listed.has(d)).map((d) => fail(start + 1, `skill "${d}" has no entry under "## Skills"`)),
    ...[...listed].filter(([name]) => !dirs.has(name)).map(([name, line]) => fail(line, `"${name}" is listed but skills/${name} does not exist`)),
  ];
};
