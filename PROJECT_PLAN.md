# 学習記録アプリケーション - プロジェクト計画書

## 概要
1日に5または10の勉強項目をタスクとして管理する学習記録アプリケーション

## 技術スタック
- **フロントエンド**: React + TypeScript + Vite
- **スタイリング**: Tailwind CSS
- **バックエンド**: Cloudflare Workers (Hono)
- **データベース**: Cloudflare D1
- **認証**: Cloudflare Access
- **デプロイ**: Cloudflare Pages + Workers

---

## 実装状況

### 完了 ✅
- [x] プロジェクトセットアップ（Vite + React + TypeScript）
- [x] Tailwind CSS 導入
- [x] Cloudflare Workers + Hono セットアップ
- [x] D1 スキーマ作成
- [x] バックエンドAPI開発
- [x] フロントエンド コアコンポーネント
- [x] フロントエンド 機能実装
- [x] ダッシュボード実装
- [x] テーマ・スタイリング（3種類）

### 残り 🚧
- [ ] Cloudflare D1 作成・マイグレーション
- [ ] Cloudflare Workers デプロイ
- [ ] Cloudflare Pages デプロイ
- [ ] Cloudflare Access 設定
- [ ] 本番動作確認

---

## 機能一覧

### 1. 認証機能
- [ ] Cloudflare Access による認証
- [ ] 自分のメールアドレスのみアクセス可能に制限

### 2. カレンダー機能
- [x] 月間カレンダー表示
- [x] 月の切り替え（前月/次月）
- [x] 日付選択で該当日のタスク表示
- [x] 当日のハイライト表示

### 3. カテゴリ管理
- [x] カテゴリ一覧表示（サイドバー）
- [x] カテゴリによるフィルタリング
- [x] カテゴリ別アイコン表示
- [x] カテゴリはDB管理（動的に追加可能）
- [x] カテゴリ追加: wrangler d1 execute コマンドでSQL直接実行

### 4. タグ機能
- [x] タスクに複数タグ付け可能（API実装済み）
- [ ] タグによるフィルタリング（UI未実装）
- [x] タグ管理（追加・削除）（API実装済み）

### 5. タスク取得アルゴリズム
- [x] カテゴリを選択
- [x] 5件または10件を選択
- [x] 選択条件に基づきタスクを取得・表示
- [x] 1日のタスクとして割り当て

### 6. タスク管理
- [x] タスク一覧表示
- [x] タスク追加機能（マスターデータ）
- [x] タスク編集機能
- [x] タスク削除機能
- [x] 重要マーク（星）の切り替え
- [x] タスク完了状態の管理

### 7. タスク詳細モーダル
- [x] タスククリックでモーダル表示
- [x] タイトル・カテゴリ表示
- [x] 詳細説明（マークダウン対応）
- [x] 「このタスクは完了しました」ボタン
- [x] 完了時メモ入力欄
- [x] モーダル閉じる（×ボタン）

### 8. メモ機能
- [x] タスク完了時にメモを記録
- [x] 学んだこと・気づきを保存
- [x] 過去のメモを振り返り可能（検索で対応）

### 9. 検索機能
- [x] タスク名で検索
- [x] メモ内容で検索
- [x] カテゴリで絞り込み

### 10. ソート機能
- [x] 重要度順ソート（API側で実装）
- [x] 完了状態順ソート（API側で実装）

### 11. ダッシュボード（学習統計）
- [x] 週間の完了タスク数
- [x] カテゴリ別の学習進捗（バー表示）
- [x] 連続学習日数（ストリーク）
- [x] 総完了タスク数

### 12. タスク表示（メイン画面）
- [x] タイトル表示
- [x] 詳細説明（プレビュー）
- [x] カテゴリタグ表示
- [x] カテゴリ別アイコン・カラー表示
- [x] 「今日のタスク: X件」統計表示

### 13. テーマ機能
- [x] Notion風テーマ
- [x] トーナルカラーテーマ
- [x] インダストリアルモダンテーマ
- [x] テーマ切り替えUI

### 14. デプロイ
- [ ] Cloudflare D1 セットアップ
- [ ] Cloudflare Workers セットアップ
- [ ] Cloudflare Pages 設定
- [ ] Cloudflare Access 設定
- [ ] 本番デプロイ

---

## データベース設計（D1）

### categories テーブル
| カラム | 型 | 説明 |
|--------|------|------|
| id | INTEGER | PK |
| name | TEXT | カテゴリ名 |
| icon | TEXT | アイコン識別子 |
| color | TEXT | カラーコード |

### tags テーブル
| カラム | 型 | 説明 |
|--------|------|------|
| id | INTEGER | PK |
| name | TEXT | タグ名 |

### tasks テーブル（マスター）
| カラム | 型 | 説明 |
|--------|------|------|
| id | INTEGER | PK |
| category_id | INTEGER | FK |
| title | TEXT | タイトル |
| description | TEXT | 詳細（Markdown） |
| created_at | TEXT | 作成日時 |

### task_tags テーブル（多対多）
| カラム | 型 | 説明 |
|--------|------|------|
| task_id | INTEGER | FK |
| tag_id | INTEGER | FK |

### daily_tasks テーブル（日次タスク）
| カラム | 型 | 説明 |
|--------|------|------|
| id | INTEGER | PK |
| task_id | INTEGER | FK |
| date | TEXT | 日付 |
| is_completed | INTEGER | 完了フラグ |
| is_starred | INTEGER | 重要フラグ |
| memo | TEXT | 完了時メモ |
| completed_at | TEXT | 完了日時 |

---

## ディレクトリ構造

```
daily-learning-app/
├── frontend/                 # React フロントエンド
│   ├── src/
│   │   ├── components/       # UIコンポーネント
│   │   ├── hooks/            # カスタムフック
│   │   ├── lib/              # APIクライアント
│   │   ├── types/            # 型定義
│   │   └── App.tsx           # メインコンポーネント
│   └── package.json
├── backend/                  # Cloudflare Workers
│   ├── src/
│   │   └── index.ts          # Hono API
│   ├── schema.sql            # D1スキーマ
│   ├── wrangler.toml         # Wrangler設定
│   └── package.json
└── PROJECT_PLAN.md           # この計画書
```

---

## デプロイ手順

### 1. Cloudflare D1 データベース作成
```bash
cd backend
wrangler d1 create daily-learning-db
# wrangler.toml の database_id を更新
npm run db:migrate:prod
```

### 2. Workers デプロイ
```bash
cd backend
npm run deploy
```

### 3. Pages デプロイ
```bash
cd frontend
npm run build
# Cloudflare Pagesでデプロイ or wrangler pages deploy dist
```

### 4. Cloudflare Access 設定
1. Cloudflare Dashboard → Zero Trust → Access → Applications
2. 新規アプリケーション作成
3. 自分のメールアドレスのみ許可するポリシー設定

---

## 次のステップ

1. **Cloudflareアカウント確認**: `wrangler login` でログイン
2. **D1データベース作成**: 上記手順を実行
3. **本番デプロイ**: Workers と Pages をデプロイ
4. **認証設定**: Cloudflare Access でアクセス制限
