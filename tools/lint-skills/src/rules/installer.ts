import { spawnSync } from "node:child_process";
import { existsSync, lstatSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Rule, Violation } from "../types.ts";

export const installerLinks: Rule = (repo) => {
  const fail = (message: string): Violation => ({ path: "install.sh", line: 1, rule: "installer-links", message });
  if (!existsSync(join(repo.root, "install.sh"))) return [fail("install.sh is missing")];

  const home = mkdtempSync(join(tmpdir(), "lint-install-"));
  try {
    const skillsDest = join(home, "skills");
    const rulesDest = join(home, "rules");
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
    return [
      ...repo.skills.filter((s) => !linked(skillsDest, s.dir)).map((s) => fail(`skill ${s.dir} was not linked`)),
      ...repo.rules.filter((r) => !linked(rulesDest, r)).map((r) => fail(`rule ${r} was not linked`)),
    ];
  } finally {
    rmSync(home, { recursive: true, force: true });
  }
};
