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

### 3. 提交并推送

```bash
git add package.json package-lock.json
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

当前未强制维护 `CHANGELOG.md`。建议在 **GitHub Release 正文** 或合并 PR 时写清：

- 用户可见变化（新页面、内容栏目、修复的问题）
- 破坏性变更（若有）
- 内容维护者需注意的 frontmatter 或路径变更

若日后引入 `CHANGELOG.md`，可采用 [Keep a Changelog](https://keepachangelog.com/) 格式。

---

## 回滚

- **站点**：在 Actions 中重新运行历史上一次成功的 workflow（若仍保留运行记录），或回退 Git 后再次推送触发构建。
- **npm 版本**：回退提交并 `npm version` 到目标版本，或手动编辑 `package.json` / `package-lock.json` 后提交（需与团队约定一致）。

---

## 参考

- 工作流：`.github/workflows/pages.yml`
- `basePath` 与静态资源：`next.config.ts`
- 线上地址示例：<https://dao-ai.github.io/ai-bike/>
