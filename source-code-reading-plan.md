# OpenUI5 源代码阅读计划

## 第1周：核心框架理解

### Day 1-2: Core.js 和框架初始化
**文件**: `src/sap.ui.core/src/sap/ui/core/Core.js`
**重点**:
- `sap.ui.getCore()` 实现
- 库初始化机制
- 模块加载系统
- 事件系统

**关键函数**:
```javascript
// 查找这些函数
sap.ui.getCore = function() { ... }
sap.ui.initLibrary = function(sLibraryName, oLibraryInfo) { ... }
sap.ui.require = function(vModuleNames, vCallback, vErrback) { ... }
```

### Day 3-4: Element.js 和控件基类
**文件**: `src/sap.ui.core/src/sap/ui/core/Element.js`
**重点**:
- 控件生命周期
- 属性管理
- 事件系统
- 渲染机制

**关键概念**:
```javascript
// 生命周期方法
Element.prototype.init = function() { ... }
Element.prototype.exit = function() { ... }
Element.prototype.setProperty = function(sPropertyName, vValue, bSuppressInvalidate) { ... }
```

### Day 5-7: MVC框架
**文件**: 
- `src/sap.ui.core/src/sap/ui/core/mvc/Controller.js`
- `src/sap.ui.core/src/sap/ui/core/mvc/View.js`
- `src/sap.ui.core/src/sap/ui/core/mvc/Model.js`

**重点**:
- 控制器初始化
- 视图渲染
- 数据绑定机制

## 第2周：控件系统

### Day 1-3: sap.m.Button.js
**文件**: `src/sap.m/src/sap/m/Button.js`
**重点**:
- 控件继承关系
- 属性定义
- 事件处理
- 渲染器实现

**学习要点**:
```javascript
// 控件定义模式
sap.ui.define([
    "sap/ui/core/Control",
    "sap/ui/core/Renderer"
], function(Control, Renderer) {
    "use strict";
    
    var Button = Control.extend("sap.m.Button", {
        metadata: {
            properties: {
                text: { type: "string", defaultValue: "" },
                enabled: { type: "boolean", defaultValue: true }
            },
            events: {
                press: {}
            }
        },
        renderer: Renderer
    });
});
```

### Day 4-5: sap.m.List.js
**文件**: `src/sap.m/src/sap/m/List.js`
**重点**:
- 聚合控件实现
- 数据绑定
- 模板渲染

### Day 6-7: 其他常用控件
- `sap.m/Page.js`
- `sap.m/Dialog.js`
- `sap.m/Input.js`

## 第3周：高级特性

### Day 1-2: 数据绑定
**文件**: 
- `src/sap.ui.core/src/sap/ui/model/Model.js`
- `src/sap.ui.core/src/sap/ui/model/json/JSONModel.js`

### Day 3-4: 路由系统
**文件**: `src/sap.m/src/sap/m/routing/Router.js`

### Day 5-7: 主题和样式
**文件**: 
- `src/sap.ui.core/src/sap/ui/core/Theming.js`
- CSS/LESS文件

## 阅读技巧

### 1. 使用IDE功能
- 设置断点调试
- 使用"Go to Definition"
- 查看调用关系

### 2. 关注设计模式
- 单例模式 (Core.js)
- 工厂模式 (控件创建)
- 观察者模式 (事件系统)
- 模板方法模式 (生命周期)

### 3. 理解命名规范
- `sap.ui.core` - 核心功能
- `sap.m` - 移动控件
- `sap.ui.layout` - 布局控件
- `sap.f` - Fiori控件

### 4. 调试技巧
```javascript
// 在浏览器控制台中
sap.ui.getCore().getConfiguration().setDebug(true);
sap.ui.getCore().getConfiguration().setLogLevel(sap.ui.core.LogLevel.DEBUG);
```

## 实践建议

### 1. 边读边写
- 创建简单的测试页面
- 尝试修改控件行为
- 实现自定义控件

### 2. 记录学习
- 画架构图
- 写学习笔记
- 总结设计模式

### 3. 参与社区
- 在GitHub上提Issue
- 参与代码审查
- 贡献代码 