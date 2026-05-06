# Changelog

本文件记录**站点与仓库**的可见变更，格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

合并至默认分支后，若仅提升 `package.json` 版本，可由 GitHub Actions 调用 `npm run changelog:release` 在「\[Unreleased\]」之下**预填**一节（基于 `git log`）；**发版前请人工整理**条目归类（Added / Changed / Fixed 等）并删去无关提交说明。日常小改动可写在 **\[Unreleased\]** 下。

## [Unreleased]

### Changed

- 页脚展示当前 `package.json` 版本号，并增加站内「更新日志」页与根目录 `CHANGELOG.md`。

## [0.3.0] - 2026-05-04

### Added

- Markdown 内容：`content/brands`、`categories`、`models`、`consult` 等演示条目与对应列表、详情路由。
- 页脚展示 `package.json` 版本号；站内「更新日志」`/changelog/`；根目录 `CHANGELOG.md` 与 `npm run changelog:release` 脚本。
- GitHub Actions：在推送包含 `package.json` 的提交时尝试为当前版本预填 Changelog 草稿（见 `RELEASING.md`）。

### Changed

- 站点布局、导航、Markdown 渲染与样式（详见提交历史）。
