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

### v0.6.0 — 2026-06-22

**OCR 架构重构：端侧推理 + 云端兜底（基于 v1.4 规格书）**

架构变更（**BREAKING**）：
- 🔴 OCR 引擎从"后端 PaddleOCR 服务"改为"端侧 Paddle.js + 云端 Textin 双引擎"
- 🔴 `app.globalData.ocrApiUrl` 替换为 `ocrConfig` 配置对象

新增文件：
- 📦 `utils/paddle-ocr.js` — Paddle.js OCR 端侧推理封装（PP-OCRv4 轻量模型）
- 📦 `utils/textin-ocr.js` — Textin 云端 OCR API 封装

重写文件：
- 🔧 `utils/ocr.js` — OcrEngine 双引擎调度（auto/local/cloud 三种模式）
  - auto 模式：端侧优先 → 置信度评估 → 云端兜底 → 模拟器降级
  - local 模式：仅端侧推理（离线可用）
  - cloud 模式：仅 Textin 云端（高精度）

配置变更：
- ⚙️ `app.js` — `ocrApiUrl` → `ocrConfig`（mode, confidenceThreshold, textinAppId, textinSecretKey, ragApiUrl）

页面适配：
- 🔧 `pages/upload/upload.js` — 适配新 OcrEngine API，自动降级
- 🔧 `pages/chat/chat.js` — RAG 后端地址从 `ocrConfig.ragApiUrl` 读取

后端变更：
- 🔧 `server/app.py` — OCR 路由标注为"管理端/备用"，新增 `/api/ocr/textin-proxy` 代理路由
- 📄 `server/.env.example` — 新增 TEXTIN_APP_ID、TEXTIN_SECRET_KEY 配置
- 📄 `server/requirements.txt` — 新增 httpx 依赖

插件集成：
- 🔌 `app.json` — 新增 Paddle.js OCR 插件声明（wx6af44e3e5d7c0c14）

### v0.5.0 — 2026-06-22

**前端 AI 问答页接入 RAG 后端**

小程序端改造：
- 🔧 `pages/chat/chat.js` — 从硬编码模拟数据改为调用真实 `/api/chat` API
  - 自动检测后端可用性（`/health` 接口检查 `rag_available`）
  - 有后端 → 调用 RAG API，返回真实合同问答结果
  - 无后端 → 降级为模拟器（MOCK_RESPONSES），不影响界面演示
  - 支持历史对话上下文（最近 3 轮）
  - 错误处理：网络失败、API 错误均有友好提示
  - 引用来源点击跳转到合同详情页
- 🔧 `pages/chat/chat.wxml` — 新增功能
  - 后端连接状态指示器（绿点=已连接，橙点=模拟模式）
  - AI 回答引用来源卡片（合同标题 + 相关度，可点击跳转）
  - 加载中动画（三点弹跳 + "正在分析合同内容..."提示）
  - 发送中禁用输入框和发送按钮
  - 错误消息气泡（红色边框区分）
- 🔧 `pages/chat/chat.wxss` — 新增样式
  - 状态指示器（`.status-dot` 绿/橙色 + 发光效果）
  - 引用来源卡片（`.source-card` 悬停高亮）
  - 打字动画（`@keyframes typing-bounce`）
  - 错误气泡（`.error-bubble` 红色边框）
  - 禁用按钮（`.send-btn.disabled` 半透明）
  - 无障碍：`prefers-reduced-motion` 关闭动画

### v0.4.0 — 2026-06-22

**RAG 智能问答 + 合同字段提取**

后端新增 RAG 模块（`server/rag/`），采用 TDD 开发，45 个测试全部通过：
- 📦 `rag/config.py` — 集中管理配置（智谱 API Key、ChromaDB 路径、切块参数）
- 📦 `rag/prompts.py` — Prompt 模板集中管理（问答 + 字段提取）
- 📦 `rag/embedder.py` — 文本向量化（智谱 embedding-2，OpenAI 兼容接口）
- 📦 `rag/indexer.py` — 合同索引（段落级切分 → 向量化 → 存 ChromaDB）
- 📦 `rag/retriever.py` — 相似度检索（余弦距离 → 相似度，阈值过滤）
- 📦 `rag/extractor.py` — 合同字段提取（甲方/金额/到期日等，JSON 输出）

后端 API 新增 3 个端点：
- 🔗 `POST /api/chat` — AI 合同问答（RAG：检索 → 组装上下文 → LLM 回答）
- 🔗 `POST /api/extract` — 合同字段提取
- 🔗 `POST /api/contracts/index` — 手动触发合同索引

后端改进：
- 🔧 `app.py` 重构：numpy/PIL 改为延迟导入，RAG 测试无需安装 OCR 依赖
- 🔧 健康检查增加 `rag_available` 字段
- 🔧 版本号升级到 2.0.0（后端独立版本）
- 📄 新增 `.env.example` 环境变量配置样例
- 📄 `requirements.txt` 新增 chromadb、openai、python-dotenv 依赖

开发环境：
- 🛠️ 安装 Python 3.12.10 + pytest 9.1.1
- 🛠️ 创建虚拟环境 `server/venv/`
- ✅ 45 个单元测试全部通过（`pytest tests/ -v`）

设计文档：
- 📄 `docs/design/rag-design.md` — RAG 架构设计文档（方案对比、数据流、成本估算）

### v0.3.0 — 2026-06-21

**PP-OCRv6 中文合同 OCR 集成**
- 📦 新增后端服务 `server/` 目录（Python FastAPI + PaddleOCR）
  - `server/app.py`: 提供文件上传、Base64、批量识别、健康检查接口
  - `server/requirements.txt`: Python 依赖清单
  - `server/README.md`: 完整的部署和使用文档
- 🛠️ 重写 `utils/ocr.js` OCR 工具模块
  - 新增 `OcrEngine` 类：调用后端 OCR 服务
  - 保留 `OcrSimulator` 类：无后端时自动降级为模拟模式
  - 支持文件上传（`wx.uploadFile`）和 Base64 两种调用方式
  - 新增图片压缩预处理（等比例缩放到 1280px，节省带宽和识别时间）
  - 新增 `healthCheck()` 健康检查方法
- 🔗 改造 `pages/upload/upload.js` 上传页面
  - 自动识别 `app.globalData.ocrApiUrl` 是否配置
  - 有后端 → 调用真实 PP-OCRv6 识别
  - 无后端 → 降级到模拟器（不影响界面演示）
- ⚙️ 在 `app.js` globalData 中新增 `ocrApiUrl` 配置项
  - 三种部署模式说明：开发模拟器 / 局域网调试 / 生产服务器

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
