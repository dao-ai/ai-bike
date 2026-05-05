# 贡献指南

感谢你愿意改进 **ai-bike**。本仓库是面向中文读者的 **自行车知识库静态站**：内容以 Markdown 为主，代码负责解析与呈现。贡献可以是 **内容**、**文档** 或 **前端/工具链** 任一方向。

---

## 行为准则

- 保持 **尊重、专业、可审查**：讨论对事不对人；避免攻击性言论与无关广告。
- **版权与事实**：勿整站抓取或镜像第三方官网；引用请注明来源；技术参数以厂商与经销商为准，本站示例/占位须标注清楚。
- **许可**：提交即表示你同意在仓库 **LICENSE**（MIT）下授权你的贡献（除非另行书面约定）。

---

## 如何贡献

### 1. 内容（推荐入门）

在 `content/` 下编辑或新增 `.md` 文件即可参与，无需改代码。

| 目录 | 用途 |
|------|------|
| `content/categories/` | 车型分类 |
| `content/brands/` | 品牌 |
| `content/series/` | 车系（产品线） |
| `content/models/` | 具体车款 |
| `content/consult/` | 选购 / 问答条目 |

**约定**：

- 使用 **YAML frontmatter**；字段含义与可选键见 `src/lib/types.ts`，解析逻辑见 `src/lib/content.ts`。
- 列表排序可使用 frontmatter **`order`**（数字越大越靠后或依实现排序，以 `sortByOrder` 为准）。
- 车款关联车系：在 model 的 frontmatter 写 **`series: <车系 slug>`**（对应 `content/series/<slug>.md`）。
- 型号详情页的「规格 / 几何 / 技术」等分区由 frontmatter 中的 `specs`、`geometry`、`technology` 等字段驱动；几何表可被车款页上的交互示意解析（见 `src/lib/parseGeometryTable.ts`）。

提交前请本地运行：

```bash
npm install
npm run build
```

确保无 TypeScript / 构建错误。

### 2. 代码与 UI

- 技术栈：**Next.js 16（App Router）**、**React 19**、**TypeScript**、**Tailwind CSS 4**、**daisyUI 5**。静态导出见 `next.config.ts`。
- 修改 `src/` 时请 **与现有风格一致**：组件命名、Tailwind 类、无无关大重构。
- 提交前执行 **`npm run lint`** 并修复新增问题。
- 若涉及 **Next 行为或 API**，请先查看 `node_modules/next/dist/docs/` 中与本任务相关的说明（仓库规则提醒：与常见 Next 版本可能有差异）。

### 3. 文档

- 根目录 **README.md**：总览与本地开发。
- **RELEASING.md**：版本与发布流程。
- **CONTRIBUTING.md**：本文件。

欢迎修正错别字、补充部署踩坑、或与 README 交叉引用。

---

## 提交流程（Pull Request）

1. **Fork** 本仓库，或若已有写权限则 **新建分支**（如 `fix/xxx`、`content/add-xxx`）。
2. 在分支上完成修改，**一个 PR 聚焦一类变更**（例如「只加某品牌车款」或「只修某页样式」），便于评审。
3. 打开 **Pull Request**：
   - 标题：简洁说明 **做什么**（中文或英文均可，团队统一即可）。
   - 正文：说明 **动机**、**主要改动**、**如何验证**（如「本地 `npm run build` 通过」）。
4. 根据评审意见更新分支；合并后 **GitHub Actions** 会在推送到默认分支时构建 Pages（见 RELEASING.md）。

---

## 不接受的贡献（示例）

- 未注明来源的大段复制官网文案。
- 与自行车知识库无关的链接农场、加密货币推广等。
- 仅用于 SEO 堆砌、无实质信息的内容。

---

## 问题与讨论

- **Bug / 功能建议**：优先使用 GitHub **Issues**，并说明复现步骤或期望行为。
- **小改动**：可直接发 PR 并在描述里简要说明。

再次感谢你的贡献。
