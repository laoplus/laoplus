<h1 align="center">LAOPLUS</h1>

<p align="center">
    <a href="https://discord.gg/EGWqTuhjrE">
        <img src="https://img.shields.io/discord/913406465312690217.svg?label=&logo=discord&logoColor=ffffff&color=5865F2&labelColor=5865F2&style=flat-square" alt="Discord" />
    </a>
</p>

**LAOPLUS** は DMM GAMES にて提供されている、DMM GAME PLAYER 版[ラストオリジン](https://www.last-origin.com/)のプレイを支援する MOD (BepinEx Plugin) です

<details>
<summary><b>0.x, 1.xについて</b></summary>

0.x, 1.x は過去にリリースされていたブラウザ版向けの userscript でした。5 月 24 日のブラウザ版のサービス終了と DMM GAME PLAYER 版への移行に伴い、LAOPLUS も移行されました。

-   [1.x のソースコード](https://github.com/eai04191/laoplus/tree/b55df450060082db4c42fdcffcd327b009bc154a)
-   [最終ビルド](https://github.com/eai04191/laoplus/tree/7c676e887ec491e8811c786c90ef7bad75e796db)

---

</details>

## Discord

[![Discord Invite](https://invidget.switchblade.xyz/EGWqTuhjrE?theme=light)](https://discord.gg/EGWqTuhjrE)

新機能の提案や開発の進捗報告などが Discord で行われています。ご参加ください！

## 機能

<details>
<summary><b>周回停止通知</b></summary>

![image](https://user-images.githubusercontent.com/3516343/172043568-021b7ab2-d95d-4d48-8ab2-d6898d356db7.png)

周回停止時に画面に出る「以下の理由で、これ以上反復戦闘が行えません。」から始まるメッセージの通知を検出したとき Discord に通知を送信します。

---

</details>

<details>
<summary><b>ホイールスクロール増幅</b></summary>

|                                                デフォルト                                                 |                                               増幅倍率 6 倍                                               |
| :-------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------: |
| ![](https://user-images.githubusercontent.com/3516343/172043512-a679f80a-91d2-49b3-838b-4483b3189f3e.gif) | ![](https://user-images.githubusercontent.com/3516343/172043513-19b3ce33-dcc5-4220-b716-b87b459a3f26.gif) |

戦闘員一覧や装備一覧などのウィンドウでホイールスクロールした際に移動量がやたら小さい問題に対する修正です。

スクロールが発生したときにこの倍率を掛け算た値分移動するようになります。

---

</details>

<details>
<summary><b>バトルログを出力</b></summary>

![](https://user-images.githubusercontent.com/3516343/173231342-598bb042-30d7-42fe-bc08-62d886656d1f.png)

バトルログをBepinExのログに出力します。特定のギミックを確認したい場合などの一時的な利用が想定されています。

ログはデフォルトで `lastoriginインストール先\BepinEx\LogOutput.log` に保存され、再起動時に過去のログが削除されます。

---

</details>

## 設定

![](https://user-images.githubusercontent.com/3516343/172048318-2b80c9eb-fcf1-4dd3-bc1e-cffb4a4b9a73.png)

AIO を導入している場合、ゲーム中に<kbd>F5</kbd>キーで設定が開き、LAOPLUS の各種設定を行えます。

設定項目の変更後は上の`Save Preferences`を押して保存することを忘れないでください。

> **Warning**
> Discord Webhook URL の変更後は再起動が必要です
> 正しい Webhook URL が設定されている場合起動時に通知が呼びだされます。

設定の実体は `lastoriginインストール先\BepInEx\config\net.laoplus.LAOPLUS.cfg`に保存されます。

不具合などで一時的にラストオリジンをアンインストールする際はこのファイルのバックアップを取り、新しい環境に差し替えることで LAOPLUS の設定を引き継ぐことが出来ます。

## 開発ポリシー

この MOD は不正をするためのものではありません。
自動操作（マクロ）や送受信内容の改ざん（チート）の機能はありません。

## インストール

### ⚠️LAOPLUS は自己責任で利用してください

LAOPLUS を利用したことによりアカウント BAN などの被害が発生したとしても、開発者は一切の責任を負いません。

<details>
<summary><b>初回インストール手順</b></summary>

LAOPLUS は「ラストオリジン」「ラストオリジン R」のどちらにも導入可能です。

1. [releases](https://github.com/eai04191/laoplus/releases) から最新の `LAOPLUS_x.x.x_AIO.zip` をダウンロードする
2. `winhttp.dll`などが入っている zip ファイルの中身をコピーする

    - ![](https://user-images.githubusercontent.com/3516343/172044273-07f20b45-7f27-453b-8c72-d27bacd602e9.png)

3. (`LastOrigin_R.exe`か`LastOrigin_N.exe`のある) 「LastOrigin のインストールフォルダ」に貼り付ける

    - ![](https://user-images.githubusercontent.com/3516343/172044274-6f21a7a1-0793-447d-90e0-02eea060a945.png)

4. ゲームを起動すると反映されているはずです

> **Note**
>
> LastOrigin のインストールフォルダは DMM GAME PLAYER の **詳細** から **ダウンロード先フォルダの表示** を選択することで開くことが出来ます
>
> 1. ![](https://user-images.githubusercontent.com/3516343/172044134-f8f994ca-24d3-4f80-bb47-18a571cd49af.png)
> 2. ![](https://user-images.githubusercontent.com/3516343/172044132-3d5d91a0-1d63-456a-b6c1-02da7090a525.png)

> **Note**
>
> AIO.zip はこれだけで導入が完了できるように
>
> -   最新の BepinEx の Bleeding Edge ビルド
> -   [BepInExConfigManager](https://github.com/sinai-dev/BepInExConfigManager)
> -   LAOPLUS
>
> が含まれています。
>
> PluginOnly.zip には LAOPLUS のみが含まれています。

手順などが不明な場合は [Discord](https://discord.gg/EGWqTuhjrE) か[作者 Twitter](https://twitter.com/eai04191) の DM で聞いてください

---

</details>

<details>
<summary><b>アンインストール手順</b></summary>

### 一時的に無効化したい場合

LastOrigin のインストールフォルダにある `winhttp.dll` を、デスクトップなど別の場所に移動させるとすべての mod が読み込まれなくなります。

### 完全にアンインストールしたい場合

LastOrigin のインストールフォルダにある

-   winhttp.dll
-   doorstop_config.ini
-   mono フォルダ
-   BepInEx フォルダ

を削除してください。

---

</details>

## FAQ

<details>
<summary><b>Android版でも使えますか</b></summary>

-   無理です
-   Android 版ゲームに BepinEx のようなゲームパッチャーを導入できれば使えるかもしれません
-   できそうな知見があればご連絡ください

---

</details>

<details>
<summary><b>LAOPLUS を使うとBANされますか</b></summary>

-   少なくとも[私](https://github.com/eai04191)はされていません
-   私が BAN されたくないので BAN されるような機能を実装するつもりもありません

---

</details>

<details>
<summary><b>LAOPLUS は利用規約に違反していますか</b></summary>

以下がラストオリジン初回起動時に表示される利用規約です

https://pig.games/ja/terms.html

自身で判断し、自己責任で使用してください。

---

</details>

<details>
<summary><b>使い方がわからない・エラーが出る・その他聞きたいことがある</b></summary>

-   [Discord](https://discord.gg/EGWqTuhjrE) か [作者 Twitter](https://twitter.com/eai04191) の DM で聞いてください

---

</details>

<details>
<summary><b>ヘッチュンヘプチュ。ヘッチュチュンヘッチュ。ムチチムチ?</b></summary>

-   しらん

---

</details>

## 開発

[CONTRIBUTING.md](CONTRIBUTING.md)を参照してください

## License

MIT License
