# 发布与版本管理

本仓库为 **Next.js 静态导出**（`output: "export"`），默认通过 **GitHub Actions** 将 `out/` 部署到 **GitHub Pages**。发布流程以「版本号 + Git 标签 + 推送到默认分支」为主；无需单独执行发布脚本。

---

## 与部署的关系

| 步骤 | 说明 |
|------|------|
| 推送到 `master` / `main` | 触发 `.github/workflows/pages.yml`：安装依赖 → `npm run build` → 上传 `out/` → `deploy-pages` |
| 手动运行工作流 | 在 GitHub **Actions → Deploy GitHub Pages → Run workflow** 可重复部署当前分支产物 |

首次或更换仓库时，请在 **Settings → Pages** 将 **Source** 设为 **GitHub Actions**（勿选「Deploy from a branch」）。详见根目录 [README.md](./README.md) 的「部署」一节。

---

## 语义化版本（SemVer）

`package.json` 中的 `version` 遵循 **MAJOR.MINOR.PATCH**：

- **MAJOR**：不兼容的站点结构、路由或内容格式变更（若发生需同步迁移说明）。
- **MINOR**：新功能、新栏目、较大内容结构扩展，且对现有使用方式兼容。
- **PATCH**：缺陷修复、文案与小样式调整、依赖安全补丁等。

---

## 发布操作（维护者）

以下在本地仓库根目录执行（PowerShell / Bash 均可）。

### 1. 确认可构建

```bash
npm ci
npm run build
```

（可选）带 GitHub Pages 子路径的本地校验：

```powershell
$env:GITHUB_ACTIONS="true"; $env:GITHUB_REPOSITORY="dao-ai/ai-bike"; npm run build
```

### 2. 提升版本号

仅改版本、不打 Git 标签：

```bash
npm version patch --no-git-tag-version   # 0.3.0 → 0.3.1
# 或
npm version minor --no-git-tag-version   # 0.3.x → 0.4.0
# 或
npm version major --no-git-tag-version   # 1.0.0
```

该命令会同步更新 `package.json` 与 `package-lock.json`。

### 2b.（推荐）预填 Changelog 草稿

在提交版本号**之前或之后**于仓库根目录执行：

```bash
npm run changelog:release
```

该脚本会在 `CHANGELOG.md` 的 **`## [Unreleased]`** 与下一节之间插入 **`## [当前 version]`** 草稿（含最近 `git log` 列表）。若该版本标题已存在则跳过。推送后 **GitHub Actions**（`.github/workflows/changelog-stamp.yml`）也会在 **仅变更 `package.json`** 的推送上尝试执行同一逻辑并提交 `CHANGELOG.md`（需仓库允许 `GITHUB_TOKEN` 写入默认分支；若受分支保护阻止，请在本机运行脚本后随版本一起提交）。

### 3. 提交并推送

```bash
git add package.json package-lock.json CHANGELOG.md
git commit -m "chore: bump version to x.y.z"
git push origin master
```

### 4.（推荐）打标签

便于在 GitHub **Releases** 中对照：

```bash
git tag -a vx.y.z -m "Release x.y.z"
git push origin vx.y.z
```

推送标签**不会**单独触发 Pages；与代码一起的 **分支推送** 才会触发构建。若先推代码再推标签，站点已是新版本内容。

### 5. 在 GitHub 上写 Release（可选）

**Releases → Draft a new release**：选择标签 `vx.y.z`，填写更新说明（可摘录 `git log` 或 PR 标题）。

---

## 变更说明（Changelog）

- **文件**：根目录 [CHANGELOG.md](./CHANGELOG.md)，格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)。
- **站内页**：构建后访问路径 **`/changelog/`**（与页脚「更新日志」链接一致）。
- **日常**：可在 **`## [Unreleased]`** 下直接写 Added / Changed / Fixed；发版前将 **`npm run changelog:release`** 生成的 **`## [x.y.z]`** 草稿整理为正式条目（删除机器生成的 `git log` 块或改写为面向读者的说明）。
- **GitHub Release**：仍可在 Release 正文中摘录要点，与 `CHANGELOG.md` 互补。

---

## 回滚

- **站点**：在 Actions 中重新运行历史上一次成功的 workflow（若仍保留运行记录），或回退 Git 后再次推送触发构建。
- **npm 版本**：回退提交并 `npm version` 到目标版本，或手动编辑 `package.json` / `package-lock.json` 后提交（需与团队约定一致）。

---

## 参考

- 工作流：`.github/workflows/pages.yml`
- `basePath` 与静态资源：`next.config.ts`
- 线上地址示例：<https://dao-ai.github.io/ai-bike/>
