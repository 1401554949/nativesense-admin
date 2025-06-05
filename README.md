# NativeSense Admin

基于 Vue 3 + Element Plus 的现代化后台管理系统

## ✨ 功能特性

- 🚀 **现代技术栈**: Vue 3 + TypeScript + Vite + Element Plus
- 🎨 **精美界面**: 响应式设计，支持暗色主题
- 🔐 **权限管理**: 基于JWT的身份认证和路由守卫
- 📱 **移动端适配**: 完美支持手机和平板设备
- 🎵 **媒体管理**: 支持视频和音频文件的上传、预览和管理
- 📊 **数据可视化**: 仪表盘展示系统概览数据
- 🔧 **开发友好**: 完善的TypeScript类型支持

## 🛠️ 技术栈

- **框架**: Vue 3.5
- **语言**: TypeScript
- **构建工具**: Vite 6.2
- **UI框架**: Element Plus 2.9
- **状态管理**: Pinia 3.0
- **路由**: Vue Router 4.5
- **HTTP客户端**: Axios
- **图标**: @element-plus/icons-vue

## 📦 安装和使用

### 环境要求

- Node.js >= 18
- pnpm >= 8

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

项目将在 `http://localhost:5173` 启动

### 构建生产版本

```bash
pnpm build
```

### 代码检查和格式化

```bash
# ESLint 检查
pnpm lint

# Prettier 格式化
pnpm format

# 类型检查
pnpm type-check
```

## 📁 项目结构

```
src/
├── api/              # API 接口
│   ├── auth.ts       # 认证相关接口
│   └── media.ts      # 媒体文件接口
├── assets/           # 静态资源
├── components/       # 公共组件
│   └── Layout.vue    # 布局组件
├── router/           # 路由配置
├── stores/           # Pinia 状态管理
│   └── user.ts       # 用户状态
├── utils/            # 工具函数
│   └── request.ts    # HTTP 请求拦截器
├── views/            # 页面组件
│   ├── audio/        # 音频管理
│   ├── video/        # 视频管理
│   ├── DashboardView.vue # 仪表盘
│   ├── LoginView.vue     # 登录页
│   └── NotFoundView.vue  # 404页面
├── App.vue           # 根组件
└── main.ts           # 入口文件
```

## 🚀 功能模块

### 登录认证
- 用户名密码登录
- JWT Token 管理
- 自动登录状态保持
- 演示账号：admin / 123456

### 仪表盘
- 系统数据概览
- 统计卡片展示
- 最近上传文件列表

### 视频管理
- 视频文件上传（拖拽支持）
- 视频列表展示和搜索
- 视频预览和下载
- 支持格式：MP4、AVI、MOV、WMV、FLV

### 音频管理
- 音频文件上传（拖拽支持）
- 音频列表展示和搜索
- 音频播放和下载
- 支持格式：MP3、WAV、AAC、FLAC、OGG

## 🔧 开发说明

### API 代理配置

开发环境下，API 请求会自动代理到 `http://localhost:3000`，你可以在 `vite.config.ts` 中修改代理配置。

### 环境变量

项目支持以下环境变量：

- `VITE_API_BASE_URL`: API 基础URL
- `VITE_APP_TITLE`: 应用标题
- `VITE_PORT`: 开发服务器端口

### 请求拦截器

在 `src/utils/request.ts` 中配置了完善的请求拦截器：

- 自动添加 JWT Token
- 统一错误处理
- Loading 状态管理
- 响应数据格式化

### 路由守卫

在 `src/router/index.ts` 中配置了路由守卫：

- 登录状态检查
- 页面权限验证
- 自动重定向

## 🎨 UI 设计

- 采用现代化的卡片式设计
- 响应式布局，适配各种屏幕尺寸
- 统一的颜色规范和交互规范
- 流畅的动画效果和过渡

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
