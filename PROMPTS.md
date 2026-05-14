# PROMPTS.md - 開発ログ＆プロンプト集

本プロジェクトの開発において使用された重要なプロンプトと、採用された回答の記録です。

## 1. アプリ設計・ロジックの構築

**指示内容:**
> GASとGemini APIを使って、講義音声を文字起こしし、さらに3行の要約と重要ポイントをまとめる「講義音声ノートAI」を作りたい。バックエンドはGASで、フロントはHTML/JSで作成して。

**採用された回答:**
- `google.script.run` を利用した非同期処理の実装。
- Gemini 1.5 Flashへのシステムプロンプトの設計（「要約」と「TODO/Decision」の分離）。

## 2. デザイン刷新 (グラスモーフィズム)

**指示内容:**
> 現在のシンプルなUIを、もっとモダンで洗練された「ダークモード × グラスモーフィズム」のデザインに変えて。カード形式で、背景は少し透けていて、境界線が光っているような高級感を出したい。

**採用された回答:**
- `backdrop-filter: blur(16px)` を利用したガラス質感。
- グラデーションを効かせたアクションボタン。
- Phosphor Iconsによる直感的なインターフェース。

## 3. 採用された外部リソース & 参考資料

開発中に参考にした主要なリソースです。

- **AIモデル**: [Gemini 1.5 Flash (Google AI Studio)](https://aistudio.google.com/)
- **アイコンセット**: [Phosphor Icons](https://phosphoricons.com/)
- **フォント**: [Inter (Google Fonts)](https://fonts.google.com/specimen/Inter)
- **CSS設計参考**: [Glassmorphism CSS Generator](https://glassmorphism.com/)
- **デプロイツール**: [clasp (Command Line Apps Script Projects)](https://github.com/google/clasp)

## 4. プロンプトの工夫点
- **システムプロンプトの固定化**: ユーザーが「3行要約」とだけ指示しなくても、常に同じ高品質なフォーマットで出力されるよう、バックエンド側で指示を固定。
- **エラーハンドリングの視覚化**: APIエラーが発生した際、ユーザーにわかりやすくトースト（通知）で知らせるロジックの追加。
