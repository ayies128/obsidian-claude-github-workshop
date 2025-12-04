# 実践③ GitHub × Obsidianで"生きてるドキュメント"

---

## 仕様の腐敗を防ぐ

- PR を merge したら「この仕様ページ更新して」とClaudeに依頼
- **差分から仕様反映まで自動**
- ObsidianはローカルだけどGitHubで**履歴管理完璧**

---

## ワークフロー

```mermaid
graph TD
    A[コード変更] --> B[PR作成]
    B --> C[レビュー・マージ]
    C --> D[Claude に仕様更新依頼]
    D --> E[Obsidian 仕様書更新]
    E --> F[GitHub に commit]
```

---

## Claude への指示例

```
このPRの変更内容を元に、
docs/specs/order.md の仕様書を更新してください
```

---

> 仕様の腐敗がなくなる（ガチで激減）

---

## 関連スライド

- 前へ: [[06_practice2|実践② テストコード自動生成]]
- 次へ: [[08_demo_nextjs_lp|デモ: Next.js LP作成]]
