---
name: snapbox-tool-writing-plans
description: 当您在编写代码之前，已经有了多步骤 Snapbox Tool 功能的规范或要求，请使用此方法。
---

# Writing Plans

## 概述

编写全面的实施计划，假设工程师对我们的代码库一无所知，而且审美也值得怀疑。记录他们需要了解的一切：每个任务需要修改哪些文件、代码、测试、可能需要查阅的文档以及测试方法。将整个计划分解成易于执行的小任务。遵循 DRY（Don't Repeat Yourself，不要重复自己）原则。遵循 YAGNI（You Aigns No I，你不需要它）原则。遵循 TDD（测试驱动开发）原则。频繁提交代码。

假设他们是一位技术娴熟的开发人员，但对我们的工具集或问题领域几乎一无所知，假设他们对优秀的测试设计也知之甚少。

**保存计划至：**: `docs/spec/YYYY-MM-DD-<feature>-plan.md`

## Feature-Driven Development Order

**关键：请遵循以下顺序：**

1. 领域定义与基础设施 (Domain & API)
   - 定义数据实体与类型
   - 编写 API 请求函数（Mock 或真实）
2. 状态管理与业务逻辑 (Zustand & Hooks)
   - 创建 Zustand Store 分片
   - 编写业务逻辑 Hook (The Logic Controller)
3. UI 实现与 Paper 规范 (Presentation)
   - 封装模块私有组件 (Internal Components)
   - 实现模块公开组件 (External Components)
4. 路由接入与端到端测试 (Navigation & E2E)
   - 注册 Expo Router 路由
   - 集成测试

## 文件结构

在定义任务之前，先规划好哪些文件将被创建或修改，以及每个文件负责什么。这是确定任务分解方案的关键一步。

- 设计单元应具有清晰的边界和明确的接口。每个文件应承担一项明确的职责。
- 你最擅长处理那些能够一次性理解其上下文的代码，而且当文件处于焦点状态时，你的编辑也更可靠。比起功能过多的大型文件，最好选择较小且功能明确的文件。
- 共同变更的文件应该放在一起。按职责划分，而不是按技术层划分。
- 在现有代码库中，遵循既定模式。如果代码库包含大型文件，不要单方面进行重构——但如果您正在修改的文件变得过于庞大，那么在计划中加入拆分是合理的。

这种结构指导着任务分解。每个任务都应该产生独立且有意义的、自包含的变更。

**参考**:

```
src/
├── app/                  # 【路由层】Expo Router 自动路由，仅做入口映射
│   ├── (auth)/           # 路由分组：认证相关
│   ├── (tabs)/           # 路由分组：主页 Tab 切换
│   ├── _layout.tsx       # 全局根布局 (注入所有 Provider)
│   └── index.tsx         # 应用初始重定向逻辑
├── features/             # 【业务逻辑层】按功能垂直拆分，核心战场
│   └── [feature-name]/   # 功能模块名 (如: todo, profile)
│       ├── api/          # 模块专用请求 (Axios 函数)
│       ├── components/   # 模块私有 UI 组件 (基于 Paper)
│       ├── hooks/        # 核心业务逻辑 (useTodoAction)
│       ├── screens/      # 完整的页面实现 (由 app/ 调用)
│       ├── store/        # Zustand 状态分片 (useTodoStore)
│       └── types.ts      # 模块专有类型定义
├── components/           # 【公共 UI 层】跨模块复用的原子组件
│   ├── ui/               # 对 Paper 组件的二次封装 (AppButton, AppInput)
│   └── layout/           # 通用布局组件 (Container, SafeScreen)
├── theme/                # 【设计系统】主题颜色、字体、Zustand 主题切换
├── services/             # 【基础设施】Axios 实例、MMKV 持久化配置
├── constants/            # 【全局常量】API 路径、枚举、配置
└── utils/                # 【工具类】格式化、验证、设备信息
```

## 计划文件页眉

所有计划都必须以这个标题开头：

```markdown
# [Feature Name] Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use snapbox-tool-executing to implement this plan task-by-task.

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach]

**Tech Stack:** [Key technologies/libraries]

---
```

## 任务结构

````markdown
### Task N: [Component Name]

**Files:**

- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py:123-145`
- Test: `tests/exact/path/to/test.py`

- [ ] **Step 1: Write the failing test**

```python
def test_specific_behavior():
    result = function(input)
    assert result == expected
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/path/test.py::test_name -v`
Expected: FAIL with "function not defined"

- [ ] **Step 3: Write minimal implementation**

```python
def function(input):
    return expected
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/path/test.py::test_name -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/path/test.py src/path/file.py
git commit -m "feat: add specific feature"
```
````

## 执行交接

保存计划后，问： “准备执行计划了吗？”

如果是：

- 使用 `snapbox-tool-executing` 技能创建详细的实施计划
