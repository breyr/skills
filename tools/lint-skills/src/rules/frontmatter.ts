import { parseFrontmatter } from "../frontmatter.ts";
import type { Repo, Rule, Violation } from "../types.ts";

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const ALLOWED_KEYS = new Set(["name", "description", "disable-model-invocation"]);

function eachSkillFrontmatter(repo: Repo, check: (path: string, dir: string, fm: Extract<ReturnType<typeof parseFrontmatter>, { ok: true }>) => Violation[]): Violation[] {
  return repo.skills.flatMap((s) => {
    if (!s.skillFile) return [];
    const fm = parseFrontmatter(s.skillFile);
    return fm.ok ? check(s.skillFile.path, s.dir, fm) : [];
  });
}

export const frontmatterSyntax: Rule = (repo) =>
  repo.skills.flatMap((s) => {
    if (!s.skillFile) return [];
    const fm = parseFrontmatter(s.skillFile);
    return fm.ok ? [] : [{ path: s.skillFile.path, line: fm.line, rule: "frontmatter-syntax", message: fm.message }];
  });

export const frontmatterName: Rule = (repo) =>
  eachSkillFrontmatter(repo, (path, dir, fm) => {
    const name = fm.fields.get("name");
    const fail = (line: number, message: string) => [{ path, line, rule: "frontmatter-name", message }];
    if (!name || name.value === "") return fail(1, "name is missing");
    if (!KEBAB.test(name.value)) return fail(name.line, `name "${name.value}" is not kebab-case`);
    if (name.value !== dir) return fail(name.line, `name "${name.value}" does not match directory "${dir}"`);
    return [];
  });

export const frontmatterDescription: Rule = (repo) =>
  eachSkillFrontmatter(repo, (path, _dir, fm) => {
    const d = fm.fields.get("description");
    return d && d.value !== ""
      ? []
      : [{ path, line: d?.line ?? 1, rule: "frontmatter-description", message: "description is missing or empty" }];
  });

export const frontmatterKeys: Rule = (repo) =>
  eachSkillFrontmatter(repo, (path, _dir, fm) =>
    [...fm.fields]
      .filter(([key]) => !ALLOWED_KEYS.has(key))
      .map(([key, { line }]) => ({ path, line, rule: "frontmatter-keys", message: `unknown frontmatter key "${key}"` })),
  );
