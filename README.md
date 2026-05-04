# ai-bike · 自行车知识库

基于 **Next.js App Router** 的静态内容站点：用 **Markdown（frontmatter + 正文）** 维护「车型分类、品牌、具体型号与选购咨询」，页面在服务端读取 `content/` 目录并渲染为可浏览的知识库。

---

## 网站功能

| 模块 | 路径 | 说明 |
|------|------|------|
| **首页** | `/` | 展示分类 / 品牌 / 型号数量，提供各栏目的快速入口 |
| **车型分类** | `/categories`、`/categories/[slug]` | 山地、公路、Gravel、城市、电助力等分类说明；支持子类型、要点列表与正文 Markdown |
| **品牌** | `/brands`、`/brands/[slug]` | 品牌简介、国家、可选官网链接；可关联该品牌下的型号 |
| **型号库** | `/models`、`/models/[slug]` | 车款条目：关联品牌与多个分类、年份、摘要与正文；列表页可按分类或品牌筛选 |
| **咨询与问答** | `/consult` | 常见问题式条目：问题、标签、关联型号与分类，正文为 Markdown |
| **404** | 自定义 `not-found` | 未命中路由时的友好提示 |

**内容维护方式**：在 `content/` 下对应子目录新增或编辑 `.md` 文件即可；frontmatter 字段由 `src/lib/content.ts` 解析（如 `order` 控制列表排序）。无需数据库。

---

## 技术与工具

| 类别 | 选用 |
|------|------|
| **框架** | [Next.js](https://nextjs.org) **16**（App Router、`app/` 目录） |
| **UI** | [React](https://react.dev) **19**、[React DOM](https://react.dev) **19** |
| **语言** | [TypeScript](https://www.typescriptlang.org) **5** |
| **样式** | [Tailwind CSS](https://tailwindcss.com) **4**（`@tailwindcss/postcss`）、自定义 CSS 变量与 `globals.css` 中的 Markdown 排版类 |
| **Markdown 元数据** | [gray-matter](https://github.com/jonschlinkert/gray-matter) 解析 YAML frontmatter |
| **Markdown 渲染** | [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm)（表格、任务列表等 GFM 语法） |
| **内容读取** | Node.js 内置 `fs` / `path`，在服务端组件中同步读取 `content/**/*.md` |
| **代码质量** | [ESLint](https://eslint.org) **9**、`eslint-config-next` |

**开发与构建工具**：Node.js、npm；字体与元数据等按 Next 默认方式配置（见 `layout.tsx`、`next.config.ts`）。

---

## 内容目录结构

```
content/
├── brands/       # 品牌，如 trek.md
├── categories/   # 车型分类，如 road.md
├── models/       # 具体型号，如 tarmac-sl8.md
└── consult/      # 咨询条目，如 c1.md
```

各文件的 frontmatter 字段约定见 `src/lib/types.ts` 与 `src/lib/content.ts` 中的解析逻辑。

---

## 本地开发

```bash
npm install
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)。修改 `content/` 或 `src/` 后保存即可热更新（开发模式）。

其他常用命令：

```bash
npm run build   # 生产构建
npm run start   # 本地运行构建产物
npm run lint    # ESLint
```

---

## 部署

可部署到 [Vercel](https://vercel.com/docs/frameworks/nextjs) 或其他支持 Node.js 与 Next.js 的平台。确保构建环境能访问仓库中的 `content/` 文件（随代码一同发布即可）。

---

## 仓库

远程示例：`git@github.com:dao-ai/ai-bike.git`（以你实际配置的 `origin` 为准）。
