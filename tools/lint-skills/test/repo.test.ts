import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadRepo } from "../src/repo.ts";

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

test("skill file paths use forward slashes", () => {
  withRepo({ "skills/alpha/SKILL.md": "x\n", "skills/alpha/references/ref.md": "x\n" }, (root) => {
    assert.deepEqual(loadRepo(root).skills[0].files, ["SKILL.md", "references/ref.md"]);
  });
});

test("tool sources under a fixtures directory are skipped", () => {
  withRepo({ "tools/t/ok.ts": "x\n", "tools/t/fixtures/bad.ts": "x\n" }, (root) => {
    assert.deepEqual(
      loadRepo(root).scripts.map((s) => s.path),
      ["tools/t/ok.ts"],
    );
  });
});
