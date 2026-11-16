import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import type { Repo, Skill, TextFile } from "./types.ts";

function readText(root: string, path: string): TextFile | null {
  const full = join(root, path);
  if (!existsSync(full)) return null;
  return { path, lines: readFileSync(full, "utf8").split("\n") };
}

function filesUnder(dir: string): string[] {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((e) => e.isFile())
    .map((e) => join(e.parentPath, e.name).slice(dir.length + 1))
    .sort();
}

function dirsIn(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

export function loadRepo(root: string): Repo {
  if (!existsSync(root) || !statSync(root).isDirectory()) {
    throw new Error(`not a directory: ${root}`);
  }
  const skills: Skill[] = dirsIn(join(root, "skills")).map((dir) => ({
    dir,
    skillFile: readText(root, `skills/${dir}/SKILL.md`),
    files: filesUnder(join(root, "skills", dir)),
  }));

  const rulesDir = join(root, "rules");
  const rules = existsSync(rulesDir)
    ? readdirSync(rulesDir, { withFileTypes: true })
        .filter((e) => e.isDirectory() || e.name.endsWith(".md"))
        .map((e) => e.name)
        .sort()
    : [];

  const toolsDir = join(root, "tools");
  const toolSources = existsSync(toolsDir)
    ? filesUnder(toolsDir)
        .filter((f) => f.endsWith(".ts") && !f.split("/").includes("fixtures"))
        .map((f) => `tools/${f}`)
    : [];
  const scripts = ["install.sh", "install.ps1", ...toolSources]
    .map((p) => readText(root, p))
    .filter((f): f is TextFile => f !== null);

  return { root, skills, readme: readText(root, "README.md"), rules, scripts };
}
