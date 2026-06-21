# 智小合 - 版本管理

> 微信小程序端版本记录

---

## 版本号规范

采用语义化版本控制（SemVer）：`主版本号.次版本号.修订号`

- **主版本号**：重大架构变更、不兼容的 API 修改
- **次版本号**：新增功能、合同类型扩展、模块增加
- **修订号**：问题修复、样式调整、性能优化

---

## 版本历史

### v0.2.1 — 2026-06-21

**无障碍访问优化（Accessibility）**
- 替换所有 `view+bindtap` 为语义化组件：
  - 可点击区域使用 `navigator`（页面跳转）或 `button`（操作按钮）
  - 搜索栏、合同列表项、底部操作按钮等均已优化
- 添加 ARIA 属性支持：
  - `aria-label`：所有按钮、图标、卡片添加描述性标签
  - `aria-hidden`：纯装饰性图标和分隔线
  - `role`：列表、列表项、标签页等语义角色
  - `aria-selected`：Tab 栏选中状态
- 表单无障碍优化：
  - 添加 `<label>` 标签关联输入框
  - 搜索页和聊天页输入框添加 id 和 label 关联

**焦点与交互状态优化**
- 添加 `:focus-visible` 焦点可见样式（红色轮廓）
- 添加 `:hover` 交互反馈（背景色、缩放效果）
- 添加 `touch-action: manipulation` 防止双击缩放延迟
- 添加 `-webkit-tap-highlight-color: transparent` 消除点击高亮
- 添加 `.sr-only` 屏幕阅读器专用类

**动画与动效优化**
- 添加 `@media (prefers-reduced-motion: reduce)` 支持
- 用户开启减少动画设置时自动禁用动画和过渡效果

**变更文件**
- `app.wxss` — 添加无障碍辅助类、焦点/hover样式、prefers-reduced-motion
- `pages/home/home.wxml` — 语义化组件、ARIA属性
- `pages/chat/chat.wxml` — 语义化组件、ARIA属性、表单label
- `pages/search/search.wxml` — 语义化组件、ARIA属性、表单label
- `pages/detail/detail.wxml` — 语义化组件、ARIA属性
- `pages/upload/upload.wxml` — 语义化组件、ARIA属性
- `pages/profile/profile.wxml` — 语义化组件、ARIA属性、badge动态数据
- `custom-tab-bar/index.wxml` — 语义化组件、ARIA属性
- `pages/home/home.wxss` — hover样式
- `pages/chat/chat.wxss` — hover/focus样式
- `pages/profile/profile.wxss` — hover样式

---

### v0.2.0 — 2026-06-16

**新增功能**
- 增加销售类合同（sales）识别与字段提取
  - 支持字段：产品名称、规格型号、销售数量、单价、总价、交货方式、付款方式、质保期
  - 识别关键词：销售、经销、代理、分销、售卖、出卖、售出
- 全局合同数据增加销售类合同示例（产品经销合同，金额85万元）

**变更文件**
- `utils/extractor.js` — 增加 sales 类型规则
- `app.js` — 增加销售类合同示例数据

---

### v0.1.0 — 2026-06-16

**初始版本**
- 微信小程序基础框架搭建
- 6个页面：首页、检索、问答、个人中心、上传、详情
- 深色红色主题（#e53935），毛玻璃效果、阴影、渐变背景
- OCR 工具模块（`utils/ocr.js`）— 支持 PaddleOCR 后端对接 + 模拟器
- 图片压缩工具（`utils/image.js`）— Canvas 压缩、Base64 转换
- 合同字段提取器（`utils/extractor.js`）— 支持技术服务、房屋租赁、采购、劳动、建设工程
- 上传页集成完整 OCR 流程：上传 → 压缩 → 识别 → 提取 → 保存
- 81x81 标准 tabBar PNG 图标

**技术栈**
- 微信小程序原生框架
- WXSS 深色主题 + backdrop-filter 毛玻璃
- 模拟数据驱动（app.globalData）

---

## 待办事项

### v0.3.0 计划
- [ ] RAG 智能问答模块集成
- [ ] 后端 API 对接（PaddleOCR 真实识别）
- [ ] 合同到期提醒推送
- [ ] 数据持久化（云数据库）

### v0.4.0 计划
- [ ] 风险扫描 Agent
- [ ] 合同分析报表
- [ ] PC 管理后台联动

---

## 版本检查清单

每次发布前确认：
- [ ] `VERSION.md` 已更新
- [ ] `project.config.json` 中 `version` 字段已更新
- [ ] `app.json` 中版本信息已更新
- [ ] 新增功能已写入版本历史
- [ ] 变更文件已记录
