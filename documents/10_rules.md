# 運用ルール（シンプルで強い）

---

## 4つのルール

1. **1ページ1機能**（迷子防止）
2. PR 出したら必ず**対応する仕様ページ更新**
3. Claudeに"**コードと仕様の矛盾チェック**"を定期実行
4. Obsidianは **GitHub に commit**（履歴も残る）

---

## ルール1：1ページ1機能

```
docs/
├── specs/
│   ├── authentication.md  ← 認証機能
│   ├── order.md           ← 注文機能
│   └── payment.md         ← 決済機能
```

ページが肥大化したら分割！

---

## ルール2：PR と仕様更新をセットに

```markdown
## PR チェックリスト
- [ ] コードレビュー完了
- [ ] テスト通過
- [ ] 仕様書更新済み ← これを忘れない！
```

---

## ルール3：矛盾チェックの自動化

```
docs/specs/ 内の仕様と src/ のコードを比較して、
矛盾や不整合があれば報告してください
```

週1回の定期実行がおすすめ

---

## ルール4：Obsidian を Git 管理

```bash
# .gitignore に追加しないこと！
# Obsidian の設定ファイルは共有しない
.obsidian/workspace.json
.obsidian/workspace-mobile.json
```

---

> 小さなルールでプロジェクト品質が**跳ね上がる**！

---

## 関連スライド

- 前へ: [[09_demo_scraping|デモ: Webスクレイピング]]
- 次へ: [[11_obsidian_sync|Obsidian Sync]]
