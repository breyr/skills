import type { Rule, TextFile, Violation } from "../types.ts";

const DEFERRAL = /\b(?:TODO|FIXME|HACK|XXX)\b|\b(?:for now|temporary|temporarily|placeholder|simplified|in a real app|assumes|not handled|not implemented)\b/i;
const SUPPRESSION = /@ts-(?:ignore|nocheck|expect-error)|eslint-disable|\bnoqa\b|type:\s*ignore|(?:istanbul|c8) ignore/;
const AS_ANY = /\bas\s+any\b/;
const COMMENTED_CODE = /^\s*(?:const|let|var|function|import|export|return|await|(?:if|for|while)\s*\().*[;{})]\s*$/;

interface Comment {
  line: number;
  text: string;
  kind: "line" | "block";
}

function hashComments(file: TextFile): Comment[] {
  return file.lines.flatMap((text, i) => {
    if (i === 0 && text.startsWith("#!")) return [];
    const m = /(?:^|\s)#(.*)$/.exec(text);
    return m ? [{ line: i + 1, text: m[1], kind: "line" as const }] : [];
  });
}

function slashComments(file: TextFile): { comments: Comment[]; code: Map<number, string> } {
  const comments: Comment[] = [];
  const code = new Map<number, string>();
  let inBlock = false;
  let quote = "";
  file.lines.forEach((text, i) => {
    const line = i + 1;
    let codeText = "";
    let commentText = "";
    let kind: Comment["kind"] = "block";
    if (quote !== "`") quote = "";
    for (let j = 0; j < text.length; j++) {
      const ch = text[j];
      const next = text[j + 1];
      if (inBlock) {
        if (ch === "*" && next === "/") {
          inBlock = false;
          j++;
        } else commentText += ch;
      } else if (quote) {
        if (ch === "\\") j++;
        else if (ch === quote) {
          quote = "";
          codeText += ch;
        }
      } else if (ch === '"' || ch === "'" || ch === "`") {
        quote = ch;
        codeText += ch;
      } else if (ch === "/" && next === "*") {
        inBlock = true;
        kind = "block";
        j++;
      } else if (ch === "/" && next === "/") {
        commentText += text.slice(j + 2);
        kind = "line";
        break;
      } else codeText += ch;
    }
    if (commentText !== "" || kind === "line") comments.push({ line, text: commentText, kind });
    code.set(line, codeText);
  });
  return { comments, code };
}

function scanFile(file: TextFile): Violation[] {
  const fail = (line: number, message: string): Violation => ({ path: file.path, line, rule: "no-excuses", message });
  const isTs = file.path.endsWith(".ts");
  const { comments, code } = isTs ? slashComments(file) : { comments: hashComments(file), code: new Map<number, string>() };

  const out: Violation[] = [];
  for (const c of comments) {
    const deferral = DEFERRAL.exec(c.text);
    if (deferral) out.push(fail(c.line, `deferral comment "${deferral[0]}"; do the work or ask`));
    const suppression = SUPPRESSION.exec(c.text);
    if (suppression) out.push(fail(c.line, `suppression "${suppression[0]}"; fix the cause`));
    if (isTs && c.kind === "line" && COMMENTED_CODE.test(c.text)) out.push(fail(c.line, "commented-out code; delete it"));
  }
  for (const [line, text] of code) {
    if (AS_ANY.test(text)) out.push(fail(line, 'unsafe any cast; fix the type'));
  }
  return out;
}

export const noExcuses: Rule = (repo) => repo.scripts.flatMap(scanFile);
