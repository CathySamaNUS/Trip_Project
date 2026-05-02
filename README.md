# 旅行回忆手账生成器 · Trip Memory Journal

把旅行里的小事，整理成一本可以重新翻开的手账。

以「地点」为骨架，记录照片、小事、人物、纪念物、感觉，自动整理成一页页可翻看的手账，并支持每个地点下的「小回忆点」单独成页。

## 技术栈

- React 18 + Vite 5
- React Router 6
- Tailwind CSS 3
- LocalStorage 持久化（前端 MVP，无后端）

## 本地运行

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 生产构建到 dist/
```

## 路由

| 路径 | 页面 |
|---|---|
| `/` | 首页 |
| `/create-trip` | 创建旅行 |
| `/trip/:tripId` | 旅行工作台 |
| `/trip/:tripId/add-location` | 添加地点 |
| `/trip/:tripId/location/:locationId/input` | 地点回忆素材填写 |
| `/trip/:tripId/location/:locationId/spots` | 小回忆点管理 |
| `/trip/:tripId/location/:locationId/preview` | 地点预览 |
| `/trip/:tripId/journal` | 整本手账预览 |

## 完整 MVP 流程

首页 → 创建旅行 → 工作台 → 添加新地点 → 上传照片/写一句话/选标签/补充人物·纪念物·原话 → 可选添加小回忆点 → 整理成手账页 → 使用这一页 → 预览整本手账。

启动时会自动写入「台湾雨天旅行」示例数据，首页点「查看示例手账」直接预览。

## 目录结构

```
src/
├── components/   // 通用组件（PaperCard / StickerTag / PhotoUploader / Lightbox …）
├── pages/        // 8 个主路由页面
└── utils/
    ├── storage.js        // localStorage CRUD
    ├── mockGenerator.js  // 把素材整理成手账页（后续可替换成真实接口）
    ├── sampleData.js     // 内置示例旅行
    └── constants.js
```

## 后续扩展

- **真实后端**：替换 `src/utils/storage.js` 内部读写为 fetch API，函数签名不变，UI 无需改动
- **真实地图**：用 Leaflet / Mapbox / 高德 JS SDK 替换 `MapRoutePreview`，`mapLocation` 字段已预留
- **真实文本整理**：把 `composeLocationMemory` 改为 async fetch
- **导出/分享**：html2canvas + jsPDF 导出 PDF / 长图

## License

MIT
