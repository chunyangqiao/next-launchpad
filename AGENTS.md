# # 仓库级 Agent 指南

## 工作原则

- 用第一性原理思考：从真实需求、代码事实和验证结果出发；目标不清楚时，先和用户讨论。
- 从代码确认当前行为。除非用户明确要求，或各级 `AGENTS.md` 指向了特定设计文档，否则不要为理解实现去读一般的 Markdown。
- 改代码之前，先读相关代码和最新的约束，并遵守目录树里离改动最近的 `AGENTS.md`。
- 改动保持聚焦，不要顺手夹带无关的重构。
- 提交时不要加任何 co-author 署名；也不要在提交说明、PR 描述或任何说明文字里透露 agent 的身份。

## 项目地图

## 环境要求

## 工作流要求

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
