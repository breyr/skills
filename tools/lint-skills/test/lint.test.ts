import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "../../..");
const cli = join(repoRoot, "tools/lint-skills/src/cli.ts");

function lint(mutate: (dir: string) => void = () => {}) {
  const dir = mkdtempSync(join(tmpdir(), "lint-skills-"));
  try {
    cpSync(join(here, "fixtures/good"), dir, { recursive: true });
    cpSync(join(repoRoot, "install.sh"), join(dir, "install.sh"));
    cpSync(join(repoRoot, "install.ps1"), join(dir, "install.ps1"));
    mutate(dir);
    const r = spawnSync("node", [cli, dir], { encoding: "utf8" });
    return { code: r.status, out: r.stdout + r.stderr };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const edit = (dir: string, file: string, from: string | RegExp, to: string) => {
  const p = join(dir, file);
  const before = readFileSync(p, "utf8");
  const after = before.replace(from, to);
  assert.notEqual(after, before, `mutation did not change ${file}`);
  writeFileSync(p, after);
};
const write = (dir: string, file: string, body: string) => {
  mkdirSync(dirname(join(dir, file)), { recursive: true });
  writeFileSync(join(dir, file), body);
};

function expectViolation(r: { code: number | null; out: string }, path: string, rule: string) {
  assert.equal(r.code, 1, r.out);
  const re = new RegExp(`^${path.replace(/\./g, "\\.")}:\\d+  ${rule}  .+`, "m");
  assert.match(r.out, re);
}

test("clean repo exits 0 with no output", () => {
  const r = lint();
  assert.equal(r.code, 0, r.out);
  assert.equal(r.out, "");
});

test("a nonexistent root exits 2", () => {
  const r = spawnSync("node", [cli, "/no/such/dir"], { encoding: "utf8" });
  assert.equal(r.status, 2);
});

test("frontmatter that never closes is flagged", () => {
  const r = lint((d) => edit(d, "skills/alpha/SKILL.md", "---\n\n# Alpha", "\n# Alpha"));
  expectViolation(r, "skills/alpha/SKILL.md", "frontmatter-syntax");
});

test("a multi-line description is flagged", () => {
  const r = lint((d) =>
    edit(d, "skills/alpha/SKILL.md", "Use when testing the linter.", "\n  Use when testing the linter."),
  );
  expectViolation(r, "skills/alpha/SKILL.md", "frontmatter-syntax");
});

test("name that differs from the directory is flagged", () => {
  const r = lint((d) => edit(d, "skills/alpha/SKILL.md", "name: alpha", "name: beta"));
  expectViolation(r, "skills/alpha/SKILL.md", "frontmatter-name");
});

test("a missing name is flagged", () => {
  const r = lint((d) => edit(d, "skills/alpha/SKILL.md", "name: alpha\n", ""));
  expectViolation(r, "skills/alpha/SKILL.md", "frontmatter-name");
});

test("a missing description is flagged", () => {
  const r = lint((d) => edit(d, "skills/alpha/SKILL.md", /description: .*\n/, ""));
  expectViolation(r, "skills/alpha/SKILL.md", "frontmatter-description");
});

test("an unknown frontmatter key is flagged", () => {
  const r = lint((d) => edit(d, "skills/alpha/SKILL.md", "disable-model-invocation: true", "color: red"));
  expectViolation(r, "skills/alpha/SKILL.md", "frontmatter-keys");
});

test("a skill directory without SKILL.md is flagged", () => {
  const r = lint((d) => write(d, "skills/gamma/notes.md", "x\n"));
  expectViolation(r, "skills/gamma", "skill-file");
});

test("a referenced file that does not exist is flagged", () => {
  const r = lint((d) => edit(d, "skills/alpha/SKILL.md", "# Alpha\n", "# Alpha\n\nAlso `references/missing.md`.\n"));
  expectViolation(r, "skills/alpha/SKILL.md", "reference-missing");
});

test("a skill absent from the README is flagged", () => {
  const r = lint((d) =>
    write(d, "skills/beta/SKILL.md", "---\nname: beta\ndescription: Another. Use when testing.\n---\n\n# Beta\n"),
  );
  expectViolation(r, "README.md", "readme-skills");
});

test("a README entry with no skill directory is flagged", () => {
  const r = lint((d) => edit(d, "README.md", "## Rules", "- `ghost`: not real.\n\n## Rules"));
  expectViolation(r, "README.md", "readme-skills");
});

test("an installer that does not link rule entries is flagged", () => {
  const skillsOnlyInstaller = [
    "#!/usr/bin/env bash",
    "set -euo pipefail",
    'root="$(cd "$(dirname "$0")" && pwd)"',
    'mkdir -p "$CLAUDE_SKILLS_DIR" "$CLAUDE_RULES_DIR"',
    'for d in "$root"/skills/*/; do ln -sfn "${d%/}" "$CLAUDE_SKILLS_DIR/$(basename "$d")"; done',
    "",
  ].join("\n");
  const r = lint((d) => write(d, "install.sh", skillsOnlyInstaller));
  expectViolation(r, "install.sh", "installer-links");
  assert.match(r.out, /rule one was not linked/);
});

test("name that is not kebab-case is flagged as such", () => {
  const r = lint((d) => edit(d, "skills/alpha/SKILL.md", "name: alpha", "name: Alpha"));
  expectViolation(r, "skills/alpha/SKILL.md", "frontmatter-name");
  assert.match(r.out, /name "Alpha" is not kebab-case/);
});

test("running with no argument exits 2", () => {
  const r = spawnSync("node", [cli], { encoding: "utf8" });
  assert.equal(r.status, 2);
});

for (const phrase of [
  "FIXME",
  "HACK",
  "XXX",
  "for now",
  "temporary",
  "placeholder",
  "simplified",
  "in a real app",
  "assumes",
  "not handled",
  "not implemented",
]) {
  test(`a comment saying "${phrase}" is flagged`, () => {
    const r = lint((d) => write(d, "tools/lint-skills/src/x.ts", `// this is ${phrase}\nexport const a = 1;\n`));
    expectViolation(r, "tools/lint-skills/src/x.ts", "no-excuses");
  });
}

test("a deferral inside a block comment is flagged at its line", () => {
  const r = lint((d) => write(d, "tools/lint-skills/src/x.ts", "/*\n * TODO later\n */\nexport const a = 1;\n"));
  expectViolation(r, "tools/lint-skills/src/x.ts", "no-excuses");
  assert.match(r.out, /^tools\/lint-skills\/src\/x\.ts:2 {2}no-excuses/m);
});

test("an any cast in TypeScript code is flagged", () => {
  const r = lint((d) => write(d, "tools/lint-skills/src/x.ts", "export const a = JSON.parse(s) as any;\n"));
  expectViolation(r, "tools/lint-skills/src/x.ts", "no-excuses");
});

test("a deferral comment in a PowerShell script is flagged", () => {
  const r = lint((d) => edit(d, "install.ps1", "$ErrorActionPreference = 'Stop'", "# TODO x\n$ErrorActionPreference = 'Stop'"));
  expectViolation(r, "install.ps1", "no-excuses");
});

test("comment markers inside string literals are not comments", () => {
  const r = lint((d) =>
    write(d, "tools/lint-skills/src/x.ts", 'const s = "// TODO not a comment";\nconst t = "/* still a string";\nexport const a = 1;\n'),
  );
  assert.equal(r.code, 0, r.out);
});

test("code after a string containing a block-comment opener is still scanned", () => {
  const r = lint((d) => write(d, "tools/lint-skills/src/x.ts", 'const t = "/*";\nexport const a = JSON.parse(s) as any;\n'));
  expectViolation(r, "tools/lint-skills/src/x.ts", "no-excuses");
  assert.match(r.out, /^tools\/lint-skills\/src\/x\.ts:2 {2}no-excuses/m);
});

test("an any cast written inside a string literal is not flagged", () => {
  const r = lint((d) => write(d, "tools/lint-skills/src/x.ts", 'export const a = "y as any";\n'));
  assert.equal(r.code, 0, r.out);
});

test("a deferral comment in a script is flagged at its line", () => {
  const r = lint((d) => edit(d, "install.sh", "#!/usr/bin/env bash\n", "#!/usr/bin/env bash\n# TODO tighten this\n"));
  expectViolation(r, "install.sh", "no-excuses");
  assert.match(r.out, /^install\.sh:2 {2}no-excuses/m);
});

test("a suppression directive in TypeScript source is flagged", () => {
  const r = lint((d) => write(d, "tools/lint-skills/src/x.ts", "// @ts-ignore\nexport const a = 1;\n"));
  expectViolation(r, "tools/lint-skills/src/x.ts", "no-excuses");
});

test("commented-out code in TypeScript source is flagged", () => {
  const r = lint((d) => write(d, "tools/lint-skills/src/x.ts", "// const old = compute(1);\nexport const a = 1;\n"));
  expectViolation(r, "tools/lint-skills/src/x.ts", "no-excuses");
});

test("all violations are reported in one run", () => {
  const r = lint((d) => {
    edit(d, "skills/alpha/SKILL.md", "name: alpha", "name: beta");
    edit(d, "README.md", "## Rules", "- `ghost`: not real.\n\n## Rules");
  });
  expectViolation(r, "skills/alpha/SKILL.md", "frontmatter-name");
  expectViolation(r, "README.md", "readme-skills");
});
