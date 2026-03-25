# MedAI Stage 2（Supabase 持久化版）

这一版完成了两件事：

1. 患者数据从“内存 / localStorage”升级为 **Supabase 持久化存储**
2. AI 仍然通过后端调用 **DeepSeek**，避免在前端泄露 API Key

## 目录结构

- `frontend/` React + Vite + Supabase JS
- `backend/` Express + DeepSeek API 代理
- `supabase/schema.sql` 建表脚本

## 一、先创建 Supabase 项目

1. 打开 Supabase，新建一个项目
2. 进入 SQL Editor
3. 执行 `supabase/schema.sql` 里的 SQL

## 二、配置前端环境变量

复制一份：

- `frontend/.env.example` → `frontend/.env`

填入：

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 三、配置后端环境变量

复制一份：

- `backend/.env.example` → `backend/.env`

填入你的 DeepSeek key。

## 四、启动

### 1）启动后端

```bash
cd backend
npm install
npm start
```

### 2）启动前端

```bash
cd frontend
npm install
npm run dev
```

打开浏览器访问 Vite 提示的地址，一般是 `http://localhost:5173`

## 当前已实现

- Dashboard 读取 patients / appointments 表
- 患者新增
- 患者搜索
- 患者删除
- AI 聊天

## 下一阶段建议

- 增加 auth 登录
- 增加患者详情页
- 增加 appointments / medications 的新增编辑
- 部署到 Vercel + Railway / Render
