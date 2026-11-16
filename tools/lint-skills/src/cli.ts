import { loadRepo } from "./repo.ts";
import { allRules } from "./rules/index.ts";
import type { Violation } from "./types.ts";

export function run(root: string): { violations: Violation[]; exitCode: 0 | 1 } {
  const repo = loadRepo(root);
  const violations = allRules
    .flatMap((rule) => rule(repo))
    .sort((a, b) => a.path.localeCompare(b.path) || a.line - b.line || a.rule.localeCompare(b.rule));
  return { violations, exitCode: violations.length ? 1 : 0 };
}

if (import.meta.main) {
  const root = process.argv[2];
  if (!root) {
    console.error("usage: cli.ts <repo-root>");
    process.exit(2);
  }
  try {
    const { violations, exitCode } = run(root);
    for (const v of violations) console.log(`${v.path}:${v.line}  ${v.rule}  ${v.message}`);
    process.exit(exitCode);
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(2);
  }
}
