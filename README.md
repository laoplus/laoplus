# LAOPLUS

LAOPLUS は DMM GAMES で配信されているブラウザ版「ラストオリジン」のプレイを支援するツールです

[LAOPLUS Discord](https://discord.gg/EGWqTuhjrE)

![screenshot](https://user-images.githubusercontent.com/3516343/143431793-af3046de-d181-40ec-9293-aa8f7bbaedfe.png)

## 開発ポリシー

このツールは

### します

-   ラスオリクライアントがサーバーから受信したデータの監視および収集
-   そのデータを利用した外部サービスとの連携
-   ゲームページの DOM やスタイルの操作

### しません

-   自発的な通信
-   自動操作（マクロ）
-   送信・受信内容の改ざん（チート）

## 機能

### 実装済み

#### ゲームサイズ変更

ブラウザ版ゲームページを開くとゲームがウィンドウいっぱいに広がります。

PWA としてインストールして使うのがおすすめです

<details>
<summary>EdgeでPWAとしてインストールする方法</summary>

1. ![2021-11-25_20-33-59_msedge](https://user-images.githubusercontent.com/3516343/143441480-1fbecedc-15c7-464a-9c9b-f26b3a83ae75.png)
2. ![2021-11-25_20-34-08_msedge](https://user-images.githubusercontent.com/3516343/143441487-360e2d9e-343b-424d-a3be-00d9223dda5e.png)
3. ![2021-11-25_20-34-17_msedge](https://user-images.githubusercontent.com/3516343/143441518-b2efd571-26e3-454f-a762-d5da9de9e199.png)

</details>

#### Discord 通知

![Discord 通知](https://user-images.githubusercontent.com/3516343/143481678-475b975b-afa7-4724-8aa3-ffeb713956d1.png)

-   ~~特定のキャラクター・アイテムドロップを検知して~~ Discord に通知します
    -   まだ設定項目がないです（SS, S キャラドロップの通知のみ）

### 実装したい

-   所持戦闘員・装備品の一覧
-   探索完了通知
-   製造完了通知
-   修復完了通知
-   編成のエクスポート
-   資源推移
-   ドロップ率などの統計情報

## インストール

### ** ⚠️LAOPLUS は自己責任で利用してください **

LAOPLUS を利用したことによりアカウント BAN などの被害が発生したとしても、製作者は一切の責任を負いません。

---

（いまのところ）このツールはある程度この手のツールやゲームの構造に知識がある人向けです。
知識がない人が使うのを避けるためにあえて詳しい説明は省きます。

1. userscript を動かせるやつを入れる（[Violentmonkey](https://violentmonkey.github.io/)推奨）
2. [src/laoplus.user.js](src/laoplus.user.js)の raw を開く
3. インストール画面が出るのでインストールする
4. [ブラウザ版ゲームページ](https://pc-play.games.dmm.co.jp/play/lastorigin_r/)を開くと反映されてるはず

## 設定

インストールできてると左下にアイコンが出ます

![LAOPLUS Button](https://user-images.githubusercontent.com/3516343/143482576-0758de82-2e7e-4dd6-a732-3ea25773284a.png)

押すと設定が開きます。閉じるときに勝手に保存します。

## FAQ

### 艦これブラウザ？

艦これやったことない
でも多分目指してるところは似てると思う

### なんで userscript？

とりあえず作るのに楽だから。将来的に Electron か WebExtension にするかもしれない

### ソースが汚い

はい

### Android 版ないの

専門外なのでない
[お船のそういうのはあるらしいので頑張れば作れるっぽい](https://github.com/antest1/kcanotify/blob/master/FAQ/FAQ_jp.md)

### ヘッチュンヘプチュ。ヘッチュチュンヘッチュ。ムチチムチ?

しらん

## License

MIT License
