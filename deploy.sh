#!/bin/bash
set -e

echo "=== Daily Learning App デプロイスクリプト ==="
echo ""

# 色の定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Wrangler ログイン確認
echo -e "${YELLOW}1. Cloudflare認証を確認中...${NC}"
if ! npx wrangler whoami > /dev/null 2>&1; then
    echo "Cloudflareにログインしてください:"
    echo "  npx wrangler login"
    echo "または環境変数を設定:"
    echo "  export CLOUDFLARE_API_TOKEN=your_token"
    exit 1
fi
echo -e "${GREEN}✓ 認証OK${NC}"
echo ""

# 2. D1データベース作成
echo -e "${YELLOW}2. D1データベースを作成中...${NC}"
cd backend

# 既存のデータベースをチェック
if npx wrangler d1 list 2>/dev/null | grep -q "daily-learning-db"; then
    echo "データベース 'daily-learning-db' は既に存在します"
else
    npx wrangler d1 create daily-learning-db
    echo ""
    echo -e "${YELLOW}重要: wrangler.toml の database_id を更新してください${NC}"
    echo "上記の出力から database_id をコピーして wrangler.toml に設定してください"
    read -p "database_id を更新したらEnterを押してください..."
fi
echo -e "${GREEN}✓ D1データベースOK${NC}"
echo ""

# 3. スキーマ適用
echo -e "${YELLOW}3. D1スキーマを適用中...${NC}"
npx wrangler d1 execute daily-learning-db --remote --file=./schema.sql
echo -e "${GREEN}✓ スキーマ適用OK${NC}"
echo ""

# 4. Workers デプロイ
echo -e "${YELLOW}4. Workersをデプロイ中...${NC}"
npx wrangler deploy
WORKER_URL=$(npx wrangler deploy 2>&1 | grep -oP 'https://[^\s]+\.workers\.dev' | head -1)
echo -e "${GREEN}✓ Workersデプロイ完了${NC}"
echo "Worker URL: $WORKER_URL"
echo ""

# 5. フロントエンドビルド
echo -e "${YELLOW}5. フロントエンドをビルド中...${NC}"
cd ../frontend

# API URLを設定
if [ -n "$WORKER_URL" ]; then
    echo "VITE_API_URL=$WORKER_URL" > .env.production
fi

npm run build
echo -e "${GREEN}✓ ビルド完了${NC}"
echo ""

# 6. Pages デプロイ
echo -e "${YELLOW}6. Pagesをデプロイ中...${NC}"
npx wrangler pages deploy dist --project-name=daily-learning-app
echo -e "${GREEN}✓ Pagesデプロイ完了${NC}"
echo ""

echo "=== デプロイ完了 ==="
echo ""
echo "次のステップ:"
echo "1. Cloudflare Dashboard でデプロイを確認"
echo "2. Zero Trust > Access で認証設定を追加"
echo "   - アプリケーションを追加"
echo "   - 自分のメールアドレスのみ許可するポリシーを設定"
