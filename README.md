# 学習記録アプリ (Daily Learning App)

1日に5〜10の勉強項目をタスクとして管理する学習記録アプリケーション

## 技術スタック

- **フロントエンド**: React + TypeScript + Vite + Tailwind CSS
- **バックエンド**: Cloudflare Workers + Hono
- **データベース**: Cloudflare D1
- **認証**: Cloudflare Access

## GitHub Actions でのデプロイ（推奨）

### 1. 事前準備（初回のみ）

ローカルでD1データベースを作成:

```bash
cd backend
npx wrangler login
npx wrangler d1 create daily-learning-db
```

出力された `database_id` を `backend/wrangler.toml` に設定してコミット。

### 2. GitHub Secrets の設定

リポジトリの Settings → Secrets and variables → Actions で以下を設定:

| Secret名 | 値 |
|----------|-----|
| `CLOUDFLARE_API_TOKEN` | Cloudflare APIトークン |
| `CLOUDFLARE_ACCOUNT_ID` | CloudflareアカウントID |
| `WORKER_URL` | Workers URL (例: `https://daily-learning-api.xxx.workers.dev`) |

### 3. D1マイグレーション実行

1. GitHub → Actions → "Setup D1 Database"
2. "Run workflow" → action: `migrate` → 実行

### 4. デプロイ

`main` ブランチにプッシュすると自動デプロイ、または Actions から手動実行。

### 5. サンプルデータ投入（オプション）

1. GitHub → Actions → "Setup D1 Database"
2. "Run workflow" → action: `seed` → 実行

---

## ローカル開発

### バックエンド

```bash
cd backend
npm install
npm run dev
```

### フロントエンド

```bash
cd frontend
npm install
npm run dev
```

## デプロイ手順

### 1. Cloudflare認証

```bash
npx wrangler login
# または
export CLOUDFLARE_API_TOKEN=your_token
```

### 2. D1データベース作成

```bash
cd backend
npx wrangler d1 create daily-learning-db
```

出力された `database_id` を `wrangler.toml` に設定:

```toml
[[d1_databases]]
binding = "DB"
database_name = "daily-learning-db"
database_id = "ここに出力されたIDを設定"
```

### 3. スキーマ適用

```bash
npx wrangler d1 execute daily-learning-db --remote --file=./schema.sql
```

### 4. Workers デプロイ

```bash
cd backend
npx wrangler deploy
```

デプロイ後に表示されるURL（例: `https://daily-learning-api.your-account.workers.dev`）をメモ

### 5. フロントエンドデプロイ

```bash
cd frontend

# API URLを設定
echo "VITE_API_URL=https://daily-learning-api.your-account.workers.dev" > .env.production

# ビルド
npm run build

# Pagesデプロイ
npx wrangler pages deploy dist --project-name=daily-learning-app
```

### 6. Cloudflare Access 設定（認証）

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) にアクセス
2. Zero Trust → Access → Applications
3. 「Add an application」→「Self-hosted」を選択
4. アプリケーション設定:
   - Application name: `Daily Learning App`
   - Application domain: デプロイしたPagesのURL
5. ポリシー設定:
   - Policy name: `Allow Me`
   - Action: `Allow`
   - Include: `Emails` → 自分のメールアドレス

## カテゴリ・タスクの追加

### カテゴリ追加（D1直接操作）

```bash
cd backend
npx wrangler d1 execute daily-learning-db --remote --command="INSERT INTO categories (name, icon, color) VALUES ('Docker', 'docker', '#2496ED')"
```

### タスク追加

```bash
npx wrangler d1 execute daily-learning-db --remote --command="INSERT INTO tasks (category_id, title, description) VALUES (1, 'Dockerfileの基本', '# Dockerfileの書き方\n\n- FROM\n- RUN\n- COPY\n- CMD')"
```

## 機能

- 📅 カレンダー表示・日付選択
- 🏷️ カテゴリ管理・フィルタリング
- ✅ タスク完了・メモ記録
- 🔍 検索機能
- 📊 ダッシュボード（統計・ストリーク）
- 🎨 3種類のテーマ切り替え
