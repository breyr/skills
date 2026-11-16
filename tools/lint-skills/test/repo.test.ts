import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadRepo } from "../src/repo.ts";
import { parseFrontmatter } from "../src/frontmatter.ts";

function withRepo(files: Record<string, string>, check: (root: string) => void) {
  const root = mkdtempSync(join(tmpdir(), "lint-repo-"));
  try {
    for (const [path, body] of Object.entries(files)) {
      mkdirSync(join(root, path, ".."), { recursive: true });
      writeFileSync(join(root, path), body);
    }
    check(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test("a SKILL.md saved with CRLF line endings parses as valid frontmatter", () => {
  const crlf = "---\r\nname: alpha\r\ndescription: Test skill.\r\n---\r\n\r\n# Alpha\r\n";
  withRepo({ "skills/alpha/SKILL.md": crlf }, (root) => {
    const file = loadRepo(root).skills[0].skillFile;
    assert.ok(file);
    const fm = parseFrontmatter(file);
    assert.equal(fm.ok, true);
    if (fm.ok) assert.equal(fm.fields.get("name")?.value, "alpha");
  });
});
