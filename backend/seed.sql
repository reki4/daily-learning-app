-- Sample Categories
INSERT INTO categories (name, icon, color) VALUES ('Docker', 'docker', '#2496ED');
INSERT INTO categories (name, icon, color) VALUES ('Go', 'go', '#00ADD8');
INSERT INTO categories (name, icon, color) VALUES ('DynamoDB', 'dynamodb', '#4053D6');
INSERT INTO categories (name, icon, color) VALUES ('ECS', 'ecs', '#FF9900');
INSERT INTO categories (name, icon, color) VALUES ('Kubernetes', 'kubernetes', '#326CE5');
INSERT INTO categories (name, icon, color) VALUES ('AWS', 'aws', '#FF9900');
INSERT INTO categories (name, icon, color) VALUES ('React', 'react', '#61DAFB');
INSERT INTO categories (name, icon, color) VALUES ('TypeScript', 'typescript', '#3178C6');

-- Sample Tasks for Docker
INSERT INTO tasks (category_id, title, description) VALUES
(1, 'Dockerfileの基本', '# Dockerfileの基本構文

## 主要な命令
- **FROM**: ベースイメージを指定
- **RUN**: コマンドを実行
- **COPY**: ファイルをコピー
- **CMD**: コンテナ起動時のコマンド
- **EXPOSE**: ポートを公開

## ベストプラクティス
- マルチステージビルドを活用
- レイヤーキャッシュを意識
- 不要なファイルを.dockerignoreで除外');

INSERT INTO tasks (category_id, title, description) VALUES
(1, 'Docker Compose入門', '# Docker Composeとは

複数コンテナを定義・管理するツール

## 基本的なコマンド
```bash
docker-compose up -d
docker-compose down
docker-compose logs -f
```

## docker-compose.yml の構造
- services
- networks
- volumes');

-- Sample Tasks for Go
INSERT INTO tasks (category_id, title, description) VALUES
(2, 'Go言語の基本構文', '# Go言語の基本

## 変数宣言
```go
var name string = "hello"
name := "hello"  // 短縮形
```

## 関数
```go
func add(a, b int) int {
    return a + b
}
```

## 構造体
```go
type User struct {
    Name string
    Age  int
}
```');

INSERT INTO tasks (category_id, title, description) VALUES
(2, 'Goの並行処理', '# Goroutineとチャネル

## Goroutine
```go
go func() {
    // 並行処理
}()
```

## チャネル
```go
ch := make(chan int)
ch <- 42     // 送信
value := <-ch // 受信
```');

-- Sample Tasks for DynamoDB
INSERT INTO tasks (category_id, title, description) VALUES
(3, 'DynamoDBの基本概念', '# DynamoDB基本

## キー構造
- **Partition Key**: 必須
- **Sort Key**: オプション

## 容量モード
- オンデマンド
- プロビジョニング

## インデックス
- GSI (Global Secondary Index)
- LSI (Local Secondary Index)');

-- Sample Tasks for ECS
INSERT INTO tasks (category_id, title, description) VALUES
(4, 'ECSの基本アーキテクチャ', '# Amazon ECS

## コンポーネント
- **クラスター**: コンテナの論理グループ
- **タスク定義**: コンテナの設定
- **サービス**: タスクの実行管理

## 起動タイプ
- Fargate (サーバーレス)
- EC2');
