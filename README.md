# Todo 應用程式

一個功能完整的待辦事項管理應用程式，使用 Next.js 15 和 Material-UI 構建，提供現代化的用戶界面和完整的 API 功能。

## 功能特色

### 前端功能
- ✅ **任務管理**: 創建、編輯、刪除和完成待辦事項
- ✅ **到期日設定**: 為任務設定到期日期
- ✅ **狀態過濾**: 查看所有、進行中或已完成的任務
- ✅ **排序功能**: 按創建時間、到期日或自定義順序排序
- ✅ **內聯編輯**: 直接在表格中編輯任務標題
- ✅ **響應式設計**: 完美適配桌面和移動設備
- ✅ **現代化 UI**: 基於 Material-UI 的美觀界面

### 後端 API
- ✅ **RESTful API**: 完整的 CRUD 操作
- ✅ **批次操作**: 批量完成/取消完成任務
- ✅ **數據驗證**: 使用 Zod 進行請求驗證
- ✅ **API 文檔**: 內建 Swagger UI 文檔
- ✅ **CORS 支援**: 跨域請求支援

## 技術棧

### 前端
- **Next.js 15** - React 全棧框架
- **React 19** - 用戶界面庫
- **Material-UI (MUI)** - UI 組件庫
- **TypeScript** - 類型安全的 JavaScript
- **Emotion** - CSS-in-JS 樣式解決方案

### 後端
- **Next.js API Routes** - 服務端 API
- **Zod** - 數據驗證和模式定義
- **Swagger/OpenAPI** - API 文檔生成
- **CUID** - 唯一標識符生成

### 開發工具
- **ESLint** - 代碼質量檢查
- **TypeScript** - 靜態類型檢查
- **Turbopack** - 快速構建工具

## 快速開始

### 安裝與啟動

```bash
# 安裝依賴
npm install
# or
pnpm install

# 啟動開發伺服器 (Port 3001)
npm run dev
# or
pnpm dev
```

- 應用程式本地 http://localhost:3001 啟動
- Vercel访问 https://react-todo-list-250926.vercel.app

### 系統需求

- Node.js >= 18.17.0
- npm / pnpm / yarn

### 訪問應用程式

- **主應用**: http://localhost:3001
- **API 文檔**: http://localhost:3001/docs
- **靜態文檔**: http://localhost:3001/docs-static

## 使用說明

### 前端操作

1. **創建任務**: 點擊 "New Task" 按鈕創建新任務
2. **編輯任務**: 點擊任務標題進行內聯編輯
3. **設定到期日**: 點擊任務行的日期欄位設定到期日
4. **標記完成**: 點擊任務前的複選框標記為完成/未完成
5. **過濾任務**: 使用頂部的過濾菜單查看不同狀態的任務
6. **排序任務**: 使用排序菜單按不同條件排序任務

## API 路由

### 基礎路由

| 方法   | 路徑              | 說明             |
| ------ | ----------------- | ---------------- |
| GET    | `/api/todos`      | 取得所有待辦事項 |
| POST   | `/api/todos`      | 新增待辦事項     |
| GET    | `/api/todos/:id`  | 取得單筆待辦事項 |
| PATCH  | `/api/todos/:id`  | 更新待辦事項     |
| DELETE | `/api/todos/:id`  | 刪除待辦事項     |
| PATCH  | `/api/todos/bulk` | 批次操作         |

### 取得列表 (GET /api/todos)

**Query 參數** (皆為可選):

- `status`: `all` | `active` | `completed` (預設: `all`)
- `search`: 字串 (模糊搜尋 title/notes)
- `sortBy`: `createdAt` | `updatedAt` | `order` | `dueDate` (預設: `createdAt`)
- `sortDir`: `asc` | `desc` (預設: `desc`)

**範例:**

```bash
# 取得所有待辦事項
GET /api/todos

# 取得未完成的待辦事項
GET /api/todos?status=active

# 搜尋包含 "test" 的待辦事項
GET /api/todos?search=test

# 依照到期日排序
GET /api/todos?sortBy=dueDate&sortDir=asc
```

### 新增待辦事項 (POST /api/todos)

**Request Body:**

```json
{
  "title": "新待辦事項", // 必填 (1-200 字元)
  "notes": "詳細說明", // 可選
  "dueDate": "2024-12-31T23:59:59.000Z", // 可選 (ISO 8601)
  "tags": ["標籤1", "標籤2"], // 可選
  "order": 1 // 可選
}
```

### 更新待辦事項 (PATCH /api/todos/:id)

**Request Body** (所有欄位皆為可選):

```json
{
  "title": "更新的標題",
  "notes": "更新的說明",
  "completed": true,
  "dueDate": "2024-12-31T23:59:59.000Z",
  "tags": ["新標籤"],
  "order": 2
}
```

### 批次操作 (PATCH /api/todos/bulk)

**完成/取消完成所有待辦事項:**

```json
{
  "action": "completeAll",
  "payload": {
    "completed": true // or false
  }
}
```

**清除已完成項目:**

```json
{
  "action": "clearCompleted",
  "payload": {}
}
```

**重新排序:**

```json
{
  "action": "reorder",
  "payload": {
    "orders": [
      { "id": "todoId1", "order": 1 },
      { "id": "todoId2", "order": 2 }
    ]
  }
}
```

## 回應格式

### 成功回應

```json
{
  "success": true,
  "data": {
    /* 資料內容 */
  }
}
```

### 錯誤回應

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "錯誤訊息",
    "details": {
      /* 錯誤詳情 */
    }
  }
}
```

### 錯誤碼

- `BAD_REQUEST`: 請求參數驗證失敗 (400)
- `NOT_FOUND`: 找不到資源 (404)
- `INTERNAL_ERROR`: 伺服器內部錯誤 (500)

## 資料模型

```typescript
interface Todo {
  id: string; // 唯一識別碼 (cuid)
  title: string; // 標題 (1-200 字元)
  completed: boolean; // 完成狀態
  createdAt: string; // 建立時間 (ISO 8601)
  updatedAt: string; // 更新時間 (ISO 8601)
  order?: number; // 排序順序 (可選)
  dueDate?: string; // 到期日 (ISO 8601, 可選)
  notes?: string; // 備註 (可選)
  tags?: string[]; // 標籤陣列 (可選)
}
```

## 測試 API

### 方式 1: Swagger UI (推薦)

開啟 http://localhost:3001/docs 使用互動式 API 文檔進行測試。

### 方式 2: REST Client

使用 VS Code REST Client 擴充套件開啟 `api.http` 檔案進行測試。

### 方式 3: curl

```bash
# 取得所有待辦事項
curl http://localhost:3001/api/todos

# 新增待辦事項
curl -X POST http://localhost:3001/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"新待辦事項"}'
```

## 資料重置

- 重啟伺服器會自動重置為種子資料
- 使用批次操作的 `clearCompleted` 可清除已完成項目

## 檔案結構

```
stark-tech-fe-interview/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API 路由
│   │   │   ├── docs/          # API 文檔路由
│   │   │   └── todos/         # 待辦事項 API
│   │   │       ├── route.ts   # GET (列表), POST (新增)
│   │   │       ├── [id]/      # 單個任務操作
│   │   │       │   └── route.ts # GET, PATCH, DELETE
│   │   │       └── bulk/      # 批次操作
│   │   │           └── route.ts
│   │   ├── docs/              # Swagger UI 頁面
│   │   ├── docs-static/       # 靜態文檔頁面
│   │   ├── globals.css        # 全域樣式
│   │   ├── layout.tsx         # 根佈局組件
│   │   ├── page.tsx           # 主頁面組件
│   │   ├── page.module.css    # 主頁面樣式
│   │   └── providers.tsx      # 主題提供者
│   ├── components/            # React 組件
│   │   ├── TodoTable.tsx      # 任務表格組件
│   │   ├── TodoRow.tsx        # 任務行組件
│   │   ├── CreateTaskDialog.tsx # 創建任務對話框
│   │   ├── DueDateDialog.tsx  # 到期日選擇對話框
│   │   ├── FilterSortMenus.tsx # 過濾排序菜單
│   │   └── index.ts           # 組件導出
│   ├── hooks/                 # 自定義 React Hooks
│   │   └── useTodos.ts        # 待辦事項狀態管理
│   ├── lib/                   # 工具庫
│   │   ├── types.ts           # 共用型別定義
│   │   ├── data.ts            # 記憶體資料儲存
│   │   ├── validations.ts     # Zod 驗證 schemas
│   │   ├── cors.ts            # CORS 處理
│   │   ├── responses.ts       # 統一回應格式
│   │   └── swagger.ts         # Swagger 配置
│   ├── services/              # API 服務
│   │   └── todoApi.ts         # 待辦事項 API 調用
│   ├── types/                 # TypeScript 型別
│   │   └── todo.ts            # 待辦事項相關型別
│   └── utils/                 # 工具函數
│       └── dateUtils.ts       # 日期處理工具
├── data/                      # 資料檔案
│   └── todos.seed.json        # 種子資料
├── public/                    # 靜態資源
├── api.http                   # REST Client 測試檔
├── package.json               # 專案配置
├── tsconfig.json              # TypeScript 配置
├── eslint.config.mjs          # ESLint 配置
└── README.md                  # 專案說明
```

### 主要組件說明

#### 前端組件
- **TodoTable**: 主要的任務表格組件，包含排序、過濾和編輯功能
- **TodoRow**: 單個任務行組件，支援內聯編輯和狀態切換
- **CreateTaskDialog**: 創建新任務的對話框
- **DueDateDialog**: 設定任務到期日的日期選擇器
- **FilterSortMenus**: 任務過濾和排序的控制組件

#### 自定義 Hooks
- **useTodos**: 管理待辦事項狀態的 Hook，包含 CRUD 操作和錯誤處理

#### API 服務
- **todoApi**: 封裝所有待辦事項相關的 API 調用，提供類型安全的接口

## 部署說明

### 生產環境構建

```bash
# 構建生產版本
npm run build

# 啟動生產服務器
npm run start
```

### 環境變數

應用程式使用以下環境變數（可選）:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Docker 部署

創建 `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001
CMD ["npm", "start"]
```

構建和運行:

```bash
# 構建 Docker 映像
docker build -t todo-app .

# 運行容器
docker run -p 3001:3001 todo-app
```

### Vercel 部署

1. 將代碼推送到 GitHub
2. 在 Vercel 中導入專案
3. 配置構建設定:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
4. 部署完成後訪問提供的 URL

### 其他平台

應用程式也可以部署到:
- **Netlify**: 支援 Next.js 靜態導出
- **Railway**: 支援 Node.js 應用
- **Heroku**: 使用 Node.js buildpack
- **AWS/GCP/Azure**: 使用各自的容器服務
