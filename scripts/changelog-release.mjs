#!/usr/bin/env node
/**
 * 在 CHANGELOG.md 的「[Unreleased]」与下一节版本之间插入「[package.json 当前版本]」草稿块，
 * 并附上最近 git 提交列表，供发版前人工整理。
 *
 * 用法：npm run changelog:release
 * 若当前版本在 CHANGELOG 中已存在对应 ## [x.y.z] 标题，则直接退出。
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const pkgPath = path.join(root, "package.json");
const changelogPath = path.join(root, "CHANGELOG.md");

const { version } = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
let changelog = fs.readFileSync(changelogPath, "utf8");

const versionHeader = `## [${version}]`;
if (changelog.includes(versionHeader)) {
  console.log(`CHANGELOG 已包含 ${versionHeader}，跳过。`);
  process.exit(0);
}

let gitlog = "";
try {
  gitlog = execSync("git log -30 --oneline --no-merges", { encoding: "utf8", cwd: root }).trim();
} catch {
  gitlog = "（无法读取 git log）";
}
const bullets = gitlog
  .split("\n")
  .filter(Boolean)
  .map((line) => `- ${line}`)
  .join("\n");

const today = new Date().toISOString().slice(0, 10);
const stamp = `${versionHeader} - ${today}

> 本节由 \`npm run changelog:release\` 预生成；发版前请改为正式条目，并归入 Added / Changed / Fixed 等子标题。

${bullets}

`;

const unreleased = "## [Unreleased]";
const idx = changelog.indexOf(unreleased);
if (idx === -1) {
  changelog = `${changelog.trimEnd()}\n\n${stamp}\n`;
} else {
  const after = idx + unreleased.length;
  const next = changelog.indexOf("\n## [", after);
  if (next === -1) {
    changelog = `${changelog.trimEnd()}\n\n${stamp}\n`;
  } else {
    changelog = changelog.slice(0, next) + `\n\n${stamp}` + changelog.slice(next);
  }
}

fs.writeFileSync(changelogPath, changelog);
console.log(`已写入 ${versionHeader} 草稿到 CHANGELOG.md，请编辑后提交。`);
