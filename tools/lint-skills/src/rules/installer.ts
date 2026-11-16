import { spawnSync } from "node:child_process";
import { existsSync, lstatSync, mkdirSync, mkdtempSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import type { Rule, Violation } from "../types.ts";

export const installerLinks: Rule = (repo) => {
  const fail = (message: string): Violation => ({ path: "install.sh", line: 1, rule: "installer-links", message });
  if (!existsSync(join(repo.root, "install.sh"))) return [fail("install.sh is missing")];

  const home = mkdtempSync(join(tmpdir(), "lint-install-"));
  try {
    const skillsDest = join(home, "skills");
    const rulesDest = join(home, "rules");
    mkdirSync(skillsDest, { recursive: true });
    mkdirSync(rulesDest, { recursive: true });
    const deadSkill = join(skillsDest, "lint-dead-skill");
    const deadRule = join(rulesDest, "lint-dead-rule.md");
    const foreign = join(skillsDest, "lint-foreign");
    symlinkSync(join(resolve(repo.root), "skills", "lint-dead-skill"), deadSkill);
    symlinkSync(join(resolve(repo.root), "rules", "lint-dead-rule.md"), deadRule);
    symlinkSync(join(home, "nowhere"), foreign);
    const run = spawnSync("bash", [join(repo.root, "install.sh")], {
      encoding: "utf8",
      env: { ...process.env, HOME: home, CLAUDE_SKILLS_DIR: skillsDest, CLAUDE_RULES_DIR: rulesDest },
    });
    if (run.status !== 0) return [fail(`install.sh exited ${run.status}: ${run.stderr.trim()}`)];

    const linked = (dest: string, name: string) => {
      try {
        return lstatSync(join(dest, name)).isSymbolicLink();
      } catch {
        return false;
      }
    };
    const exists = (p: string) => {
      try {
        lstatSync(p);
        return true;
      } catch {
        return false;
      }
    };
    return [
      ...[deadSkill, deadRule].filter(exists).map((p) => fail(`dead link ${p.slice(home.length + 1)} into the repo was not removed`)),
      ...(exists(foreign) ? [] : [fail("a dead link pointing outside the repo was removed")]),
      ...repo.skills.filter((s) => !linked(skillsDest, s.dir)).map((s) => fail(`skill ${s.dir} was not linked`)),
      ...repo.rules.filter((r) => !linked(rulesDest, r)).map((r) => fail(`rule ${r} was not linked`)),
    ];
  } finally {
    rmSync(home, { recursive: true, force: true });
  }
};
