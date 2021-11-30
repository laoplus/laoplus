<h1 align="center">LAOPLUS</h1>

<p align="center">
    <!-- <a href="https://github.com/eai04191/laoplus/blob/main/LICENSE">
        <img src="https://img.shields.io/github/license/eai04191/laoplus?style=flat-square" alt="MIT License" />
    </a> -->
    <a href="https://discord.gg/EGWqTuhjrE">
        <img src="https://img.shields.io/discord/913406465312690217.svg?label=&logo=discord&logoColor=ffffff&color=5865F2&labelColor=5865F2&style=flat-square" alt="Discord" />
    </a>
</p>

**LAOPLUS** は DMM GAMES / FANZA GAMES にて提供されている、ブラウザ版[ラストオリジン](https://www.last-origin.com/)のプレイを支援する Userscript です

## 機能

<details>
<summary><b>画面サイズの自動調整</b></summary>

![screenshot](https://user-images.githubusercontent.com/3516343/143431793-af3046de-d181-40ec-9293-aa8f7bbaedfe.png)

ゲームページを開くとウィンドウいっぱいにゲーム画面が広がるようになります。また、ゲームの解像度を更新するため、拡縮しても文字やキャラが潰れることがありません。

PWA としてインストールするとより便利に使えます

<details>
<summary>Microsoft Edge で PWA としてインストールする方法</summary>

1. ![2021-11-25_20-33-59_msedge](https://user-images.githubusercontent.com/3516343/143441480-1fbecedc-15c7-464a-9c9b-f26b3a83ae75.png)
2. ![2021-11-25_20-34-08_msedge](https://user-images.githubusercontent.com/3516343/143441487-360e2d9e-343b-424d-a3be-00d9223dda5e.png)
3. ![2021-11-25_20-34-17_msedge](https://user-images.githubusercontent.com/3516343/143441518-b2efd571-26e3-454f-a762-d5da9de9e199.png)

---

</details>

---

</details>

<details>
<summary><b>ドロップしたキャラクター・装備の通知</b></summary>

![image](https://user-images.githubusercontent.com/3516343/143925781-fc18cb07-7261-4d16-a89d-8ca65e0c3bb4.png)

キャラクタードロップを検知して Discord にメッセージを送信します

※ 現状ではキャラクター名やランクが設定できず、**SS, S ランクのキャラクタードロップ**のみ通知されます

※ キャラクター名やランクの指定は今後実装予定です

---

</details>

### 実装予定の機能

-   探索・製造・修復など時間がかかる挙動の完了通知
-   編成情報のエクスポート
-   アイテムや資源の所持数記録と推移
-   いつでも所持戦闘員・装備品の一覧を見れる画面
-   クリア回数やドロップ率などの統計情報を見れる画面

## 開発ポリシー

このスクリプトは不正をするためのものではありません。

### します

-   ラストオリジンのゲームクライアントがサーバーから受信したデータの監視
-   受信データを利用した外部サービスとの連携
-   ゲーム関連ページの DOM やスタイルの操作

### しません

-   自発的なラストオリジンのゲームサーバーへの通信
-   自動操作（マクロ）
-   送信・受信内容の改ざん（チート）

## インストール

### ⚠️LAOPLUS は自己責任で利用してください

LAOPLUS を利用したことによりアカウント BAN などの被害が発生したとしても、開発者は一切の責任を負いません。

<details>
<summary><b>インストール手順</b></summary>

1. ブラウザに好きな UserScript マネージャーを導入する
    - 開発の際は Microsoft Edge に入れた [Violentmonkey](https://violentmonkey.github.io/) で動作確認を行っているため、この組み合わせを推奨します
2. [laoplus.user.js](https://github.com/eai04191/laoplus/raw/dist/laoplus.user.js) を開く
3. インストールする
4. ゲームのページを開くと反映されているはずです

---

</details>

## FAQ

<details>
<summary><b>Android版でも使えますか</b></summary>

ラストオリジンのブラウザ版ではブラウザでゲームが動いているため、ブラウザに拡張機能を導入することで安易に通信を傍受できますが、Android アプリ版の通信を傍受するには Android の自体の通信に介入する必要があります。これには高度な技術が必要で、私には難しいです。

[某お船のゲームでは既存のソリューションがある](https://github.com/antest1/kcanotify/blob/master/FAQ/FAQ_jp.md) らしいので技術がある人なら可能かもしれません。

---

</details>

<details>
<summary><b>LAOPLUS を使うとBANされますか</b></summary>

少なくとも[私](https://github.com/eai04191)はされていません。私が BAN されたくないので BAN されるような機能を実装するつもりもありません。

---

</details>

<details>
<summary><b>LAOPLUS は利用規約に違反していますか</b></summary>

以下がラストオリジン初回起動時に表示される利用規約です

https://pig.games/ja/terms.html

これを見る限りでは LAOPLUS の機能は利用規約に違反していないと考えています。

この手のツールに最も関連していそうなのは

> ・本サービスのサーバやネットワークシステムに支障を与える行為、BOT、チートツール、その他の技術的手段を利用してサービスを不正に操作する行為、本サービスの不具合を意図的に利用する行為、ルーチングやジェイルブレイク等改変を行った通信端末にて本サービスにアクセスする行為、同様の質問を必要以上に繰り返す等、当社に対し不当な問い合わせまたは要求をする行為、その他当社による本サービスの運営または他のお客様による本サービスの利用を妨害し、これらに支障を与える行為。

ですが、そもそも、LAOPLUS はラストオリジンのサーバーにデータを送信しません。そのため規約で挙げられている「サービスを不正に操作する行為」や「不正に操作する行為」、「不当な問い合わせまたは要求をする行為」とは言えません。

ただし、

> その他、当社が不適当と判断した行為。

により処罰される可能性は（LAOPLUS 使用の有無に関わらず）常にあります。

<details>
<summary><b>ぶっちゃけた話</b></summary>

挙動的には広告ブロッカーみたいなもので、広告ブロッカー入れたままゲームしても BAN されないと思う。

なんなら広告ブロッカーは通信を書き換えることもあるけど LAOPLUS はそれすらしない。

---

</details>

---

</details>

<details>
<summary><b>LAOPLUS を使ったことを運営は知り得ますか</b></summary>

（知ろうと思えば）知り得ます

---

</details>

<details>
<summary><b>使い方がわからない・エラーが出る・その他聞きたいことがある</b></summary>

[Discord](https://discord.gg/EGWqTuhjrE) で聞いてください

---

</details>

<details>
<summary><b>ヘッチュンヘプチュ。ヘッチュチュンヘッチュ。ムチチムチ?</b></summary>

しらん

---

</details>

## 開発

<details>
<summary><b>開発について</b></summary>

開発に協力していただけると大変助かります。

このリポジトリの Git ワークフローには GitHub Flow が採用されています

1. 開発する際は develop ブランチから feature/ ブランチを切る
2. 機能を作成したら develop ブランチへ Pull Request を送信する
3. develop ブランチでの開発が進み、リリースの準備ができたら main ブランチへ PR、merge する
4. main ブランチへマージされると自動で GitHub Actions が稼働し dist ブランチへ push される
5. 開発者ではないユーザーは dist に push されたビルドを使用する

また、開発する際は Discord にて積極的に情報を共有いただけると助かります。（作業がかぶるとつらいので）

### 開発に必要なもの

-   node.js
-   yarn
-   git, GitHub の知識

1. リポジトリをクローンする
2. `yarn install`で依存関係をインストール
3. `yarn watch`で`dist`に `laoplus.user.js` が作成される。以降 watch 中は `src` を編集するたびに自動で更新される
4. ブラウザで `laoplus.user.js` を開くと Userscript マネージャーのインストール画面が開くので入れる
5. 好きにいじる

<details>
<summary><b>Userscript マネージャーのインストール画面が開かない場合</b></summary>

デフォルトでは拡張機能はローカルのファイルを読めないので、ブラウザの設定から Userscript マネージャーがローカルのファイルにアクセスする許可を与えてください

![image](https://user-images.githubusercontent.com/3516343/143915791-717bdf1c-e512-4125-ba2c-216f979aff0f.png)

---

</details>

---

</details>

## Special Thanks

-   https://github.com/rinsuki : Rollup と GitHub Actions を用いた userscript 開発ベースとして https://github.com/rinsuki/userscripts を参考にさせていただきました。
-   https://github.com/WolfgangKurz : LAOPLUS にて [滅亡前の戦術教本](https://lo.swaytwig.com/) のデータを用いることをご快諾していただきました。

## License

MIT License
