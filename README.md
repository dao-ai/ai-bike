# ai-bike · 自行车知识库

基于 **Next.js App Router** 的静态内容站点：用 **Markdown（frontmatter + 正文）** 维护「车型分类、品牌、具体型号与选购咨询」，页面在服务端读取 `content/` 目录并渲染为可浏览的知识库。

---

## 网站功能

| 模块 | 路径 | 说明 |
|------|------|------|
| **首页** | `/` | 展示分类 / 品牌 / 型号数量，提供各栏目的快速入口 |
| **车型分类** | `/categories`、`/categories/[slug]` | 山地、公路、Gravel、城市、电助力等分类说明；支持子类型、要点列表与正文 Markdown |
| **品牌** | `/brands`、`/brands/[slug]` | 品牌简介、国家、可选官网链接；可关联该品牌下的型号 |
| **型号库** | `/models`、`/models/[slug]` | 车款条目：品牌/分类/年份/摘要 + 可选「要点、零售价、原厂链接、尺码提示」；正文支持 **概览 / 规格 / 几何 / 技术** 分区（见 `src/lib/types.ts` 中 `Model` 与示例 `content/models/one-sixty-500.md`） |
| **咨询与问答** | `/consult` | 常见问题式条目：问题、标签、关联型号与分类，正文为 Markdown |
| **404** | 自定义 `not-found` | 未命中路由时的友好提示 |

**内容维护方式**：在 `content/` 下对应子目录新增或编辑 `.md` 文件即可；frontmatter 字段由 `src/lib/content.ts` 解析（如 `order` 控制列表排序）。无需数据库。

---

## 技术与工具

| 类别 | 选用 |
|------|------|
| **框架** | [Next.js](https://nextjs.org) **16**（App Router、`app/` 目录、`output: "export"` 静态导出至 `out/`） |
| **UI** | [React](https://react.dev) **19**、[React DOM](https://react.dev) **19** |
| **语言** | [TypeScript](https://www.typescriptlang.org) **5** |
| **样式与 UI** | [Tailwind CSS](https://tailwindcss.com) **4**（`@tailwindcss/postcss`）、[daisyUI](https://daisyui.com) **5**（`@plugin "daisyui"`，`emerald` / 系统暗色主题）、`globals.css` 中的 Markdown 排版 |
| **Markdown 元数据** | [gray-matter](https://github.com/jonschlinkert/gray-matter) 解析 YAML frontmatter |
| **Markdown 渲染** | [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm)（表格、任务列表等 GFM 语法） |
| **内容读取** | Node.js 内置 `fs` / `path`，在服务端组件中同步读取 `content/**/*.md` |
| **代码质量** | [ESLint](https://eslint.org) **9**、`eslint-config-next` |

**开发与构建工具**：Node.js、npm；字体与元数据等按 Next 默认方式配置（见 `layout.tsx`、`next.config.ts`）。

---

## 当前开发工具与 AI

### 日常开发工具（维护本仓库时的典型环境）

| 类型 | 说明 |
|------|------|
| **IDE** | [Cursor](https://cursor.com)（基于 VS Code），便于 TypeScript、Tailwind、Git 与内置终端一体使用；也可用 [VS Code](https://code.visualstudio.com) 打开同一仓库 |
| **操作系统** | Windows 10+（本机开发与调试） |
| **终端 / Shell** | **PowerShell**；需要运行 Bash 脚本或规避 Shell 转义问题时，可使用 **Git for Windows** 自带的 **Git Bash** |
| **运行时与包管理** | **Node.js**（建议使用 [Current / LTS](https://nodejs.org/)）、**npm** |
| **版本控制** | **Git**（本地提交、SSH 远程 `origin` 等） |

### AI 辅助与模型说明

| 项目 | 说明 |
|------|------|
| **AI 产品** | **Cursor** 内置能力：**Chat**、**Agent（代理）**、**Composer** 等，用于补全、重构、写文档与执行终端命令链 |
| **模型如何确定** | 具体 **大模型名称与版本** 由 Cursor **账户、订阅与「设置 → 模型」** 决定，会随 Cursor 产品更新而变化；团队开发时建议在组织内约定默认模型，便于评审与风格一致 |
| **路由 / Auto** | 若在 Cursor 中选择 **Auto（自动）**，则由 **Cursor 的路由逻辑**在可用模型间分配请求，而不固定为某一个底层型号 |
| **本 README 维护示例** | 文稿与部分仓库操作在 **Cursor Agent** 对话中完成；对话侧展示为 Cursor **Agent + Auto 路由**（底层实际模型以你当时 Cursor 界面所选为准） |

> 若需在文档中固定记录「团队默认模型」，请把实际在 Cursor 里选用的模型名（如某款 Claude / GPT 等）写进团队规范或本段表格，并随 Cursor 升级定期核对。

---

## 内容目录结构

```
content/
├── brands/       # 品牌，如 trek.md
├── categories/   # 车型分类，如 road.md
├── models/       # 具体型号，如 tarmac-sl8.md
└── consult/      # 咨询条目，如 c1.md
```

各文件的 frontmatter 字段约定见 `src/lib/types.ts` 与 `src/lib/content.ts` 中的解析逻辑。型号详情页信息架构参考常见品牌官网车款页（如 [MERIDA 美利达](https://www.merida.cn/)），**不抓取、不镜像**第三方站点内容；表格与长文由维护者自行编写或标注为占位说明。

---

## 本地开发

```bash
npm install
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)。修改 `content/` 或 `src/` 后保存即可热更新（开发模式）。

其他常用命令：

```bash
npm run build   # 静态导出到 out/（默认无 basePath，便于本地打开）
npm run lint    # ESLint
```

本地预览 **GitHub Pages 同款路径**（带 `/ai-bike` 前缀）时，构建前设置环境变量，例如 PowerShell：

```powershell
$env:NEXT_BASE_PATH="/ai-bike"; npm run build
```

或模拟 CI（与仓库名一致时等价于 `/ai-bike`）：

```powershell
$env:GITHUB_ACTIONS="true"; $env:GITHUB_REPOSITORY="dao-ai/ai-bike"; npm run build
```

再用任意静态文件服务器打开 `out` 目录（`npx serve out` 等），从 `/ai-bike/` 路径访问。

> 仓库已启用 `output: "export"`，**不再使用** `next start` 提供生产服务；线上以静态文件托管为准。

---

## 部署

### GitHub Pages（官方「GitHub Actions」源）

这是 GitHub 当前推荐的静态站点方式：**不会生成 `gh-pages` 分支**，由工作流上传 `out/` 工件并由 Pages 发布（与许多模板 / Codex 默认行为一致）。

- **工作流**：`.github/workflows/pages.yml` — `npm ci` → `npm run build` → `actions/upload-pages-artifact` → `actions/deploy-pages`（构建日志中含一步校验 `out/index.html` 与 `out/_next`）。
- **线上地址**：[https://dao-ai.github.io/ai-bike/](https://dao-ai.github.io/ai-bike/)
- **只需配置一次**  
  打开仓库 **Settings → Pages**，在 **Build and deployment** 里把 **Source** 设为 **GitHub Actions**（不要选「Deploy from a branch」）。保存后推送 `master`/`main` 或手动运行工作流即可。  
  一般 **不需要** 把 Actions 的 Workflow permissions 改成「Read and write」（本工作流用 `pages: write` + `id-token: write` 发布，不向仓库推分支）。  
  若组织策略要求 **首次** 审批 `github-pages` 环境，到 **Actions** 里通过一次即可。
- **路径**：在 **GitHub Actions** 构建时由 `next.config.ts` 根据 `GITHUB_REPOSITORY` 自动设置 `basePath`（形如 `/ai-bike`），与 `https://<org>.github.io/<仓库名>/` 一致；也可用环境变量 `NEXT_BASE_PATH` 覆盖。`public/.nojekyll` 避免 Jekyll 忽略 `_next`。
- **若浏览器整站 404（GitHub 默认 404 页）**：通常是 **尚未成功发布**，请打开 **Actions → Deploy GitHub Pages** 查看最新运行是否全部成功；**deploy** 若卡在「Waiting for approval」，到 **Settings → Environments → github-pages** 关闭保护规则或完成审批。另请确认组织未禁用 Pages、仓库为 **Public**（免费账户下私有仓库的 Pages 策略可能受限）。

### 其他平台

也可将 `out/` 目录上传到任意静态托管（S3、Cloudflare Pages、Netlify 等）。若站点挂在子路径下，构建时同样设置 `NEXT_BASE_PATH` 为对应前缀（勿带尾部斜杠）。

[Vercel](https://vercel.com/docs/frameworks/nextjs) 等若使用 **SSR** 而非纯静态导出，需去掉 `output: "export"` 并改用适配该平台的 Next 部署方式（与本仓库当前默认不同）。

---

## 仓库

远程示例：`git@github.com:dao-ai/ai-bike.git`（以你实际配置的 `origin` 为准）。
