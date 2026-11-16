export interface Violation {
  path: string;
  line: number;
  rule: string;
  message: string;
}

export interface TextFile {
  path: string;
  lines: string[];
}

export interface Skill {
  dir: string;
  skillFile: TextFile | null;
  files: string[];
}

export interface Repo {
  root: string;
  skills: Skill[];
  readme: TextFile | null;
  rules: string[];
  scripts: TextFile[];
}

export type Rule = (repo: Repo) => Violation[];
