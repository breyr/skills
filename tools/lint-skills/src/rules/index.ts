import { frontmatterDescription, frontmatterKeys, frontmatterName, frontmatterSyntax } from "./frontmatter.ts";
import { installerLinks } from "./installer.ts";
import { referenceMissing, skillFile } from "./layout.ts";
import { noExcuses } from "./no-excuses.ts";
import { readmeSkills } from "./readme.ts";
import type { Rule } from "../types.ts";

export const allRules: Rule[] = [
  skillFile,
  frontmatterSyntax,
  frontmatterName,
  frontmatterDescription,
  frontmatterKeys,
  referenceMissing,
  readmeSkills,
  installerLinks,
  noExcuses,
];
