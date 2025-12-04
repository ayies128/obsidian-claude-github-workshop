# 実践① Obsidianをプロジェクトに置く意味

---

## なぜプロジェクト内にVaultを置くのか？

- プロジェクトフォルダ内に **Obsidian Vault** を丸ごと置く
- Claude Code が **コードを自動で解析**してくれる
- 「このディレクトリの役割まとめて」→ 即説明ドキュメント化
- PRレビュー内容もObsidianに自動で反映できる

---

## フォルダ構成例

```
my-project/
├── src/
├── tests/
├── docs/           ← Obsidian Vault
│   ├── specs/      ← 仕様書
│   ├── decisions/  ← 意思決定記録
│   └── meetings/   ← 会議メモ
└── package.json
```

---

> "書く"より**"育てる"**感覚で仕様書が生まれる！

---

## 関連スライド

- 前へ: [[04_vs_notion|Obsidian vs Notion]]
- 次へ: [[06_practice2|実践② テストコード自動生成]]
