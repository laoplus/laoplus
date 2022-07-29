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

### 通知

<details>
<summary><b>周回停止通知</b></summary>

![](https://user-images.githubusercontent.com/3516343/173385903-6157a00e-e7bf-402d-baa8-65ae4f5c5a16.png)

周回停止時に画面に出る「以下の理由で、これ以上反復戦闘が行えません。」から始まるメッセージの通知を検出したとき Discord に通知を送信します。

---

</details>

<details>
<summary><b>ドロップ通知</b></summary>

![](https://user-images.githubusercontent.com/3516343/173386269-55be8420-273f-424c-9336-59dc637772b6.png)

ウェーブごとのユニットと装備品の入手を検知して Discord に通知を送信します。

---

</details>

### スクロール

<details>
<summary><b>スクロール倍率</b></summary>

|                                                デフォルト                                                 |                                            スクロール倍率 6 倍                                            |
| :-------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------: |
| ![](https://user-images.githubusercontent.com/3516343/172043512-a679f80a-91d2-49b3-838b-4483b3189f3e.gif) | ![](https://user-images.githubusercontent.com/3516343/172043513-19b3ce33-dcc5-4220-b716-b87b459a3f26.gif) |

戦闘員一覧や装備一覧などのウィンドウでホイールスクロールした際に移動量がやたら小さい問題に対する修正です。

スクロールが発生したときにこの倍率を掛けた値分スクロールするようになります。

---

</details>

### 基地

<details>
<summary><b>基地受取時自動再作動</b></summary>

https://user-images.githubusercontent.com/3516343/173115422-5cf61115-4a0a-4cdf-9f79-13147491997f.mp4

基地の生産施設にて製作報酬を受取時、自動でポップアップ内の再作動ボタンを押します。

---

</details>

### ログ

<details>
<summary><b>バトルログを出力</b></summary>

![](https://user-images.githubusercontent.com/3516343/173231815-47bfff0e-3523-4ec6-a4aa-9e6c6f872738.png)

バトルログを BepinEx のログに出力します。特定のギミックを確認したい場合などの一時的な利用が想定されています。

ログはデフォルトで `lastoriginインストール先\BepinEx\LogOutput.log` に保存され、再起動時に過去のログが削除されます。

---

</details>

### その他

<details>
<summary><b>プレミアムログインボーナス振り直し時の表示待機時間を削除</b></summary>

https://user-images.githubusercontent.com/3516343/176680128-269b23a7-0f97-44ac-b67a-dc9d6730916c.mp4

通常 1 つずつ表示されるプレミアムログインボーナスの表示待機時間を削除し、すべて同時に表示されるようにします。

---

</details>

<details>
<summary><b>アイテム詳細ツールチップに所持数を表示</b></summary>

![](https://user-images.githubusercontent.com/3516343/181692396-a456800c-cb9c-470c-8626-7b5d9ad7f13c.png)

アイテム長押し時に表示される項目詳細情報にそのアイテムの所持数を表示します。

---

</details>

<details>
<summary><b>アイテム交換所の交換画面に所持数を表示</b></summary>

![](https://user-images.githubusercontent.com/3516343/181692711-fed7e7f3-77f2-4e81-800d-4862ff25ae82.png)

アイテム交換所の交換画面にそのアイテムの所持数を表示します。

---

</details>

## 設定

![](https://user-images.githubusercontent.com/3516343/173232374-95b1b5c5-267f-4abe-8d1a-5d4bf236ae43.png)

AIO を導入している場合、ゲーム中に<kbd>F5</kbd>キーで設定が開き、LAOPLUS の各種設定を行えます。

**設定項目の変更後は上の`Save Preferences`を押して保存することを忘れないでください。**

> **Note**
>
> 正しい Webhook URL が設定された場合、設定保存時とゲーム起動時に通知が呼びだされます。
>
> ![](https://user-images.githubusercontent.com/3516343/173385706-54fd8eb4-de3f-4fda-ab4c-4be834bb1fe4.png)

設定の実体は `lastoriginインストール先\BepInEx\config\net.laoplus.LAOPLUS.cfg`に保存されます。

不具合などで一時的にラストオリジンをアンインストールする際はこのファイルのバックアップを取り、新しい環境に差し替えることで LAOPLUS の設定を引き継ぐことが出来ます。

## 開発ポリシー

この MOD は不正をするためのものではありません。

マクロのような自動操作や通信内容を改ざんする機能はありません。

## インストール

### ⚠️LAOPLUS は自己責任で利用してください

LAOPLUS を利用したことによりアカウント BAN などの被害が発生したとしても、開発者は一切の責任を負いません。

<details>
<summary><b>新規インストール手順</b></summary>

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
> -   [最新の BepinEx の Bleeding Edge ビルド](https://builds.bepinex.dev/projects/bepinex_be)
> -   [BepInExConfigManager](https://github.com/sinai-dev/BepInExConfigManager)
> -   [UniverseLib](https://github.com/sinai-dev/UniverseLib)
> -   LAOPLUS
>
> が含まれています。
>
> PluginOnly.zip には LAOPLUS のみが含まれています。

手順などが不明な場合は [Discord](https://discord.gg/EGWqTuhjrE) か[作者 Twitter](https://twitter.com/eai04191) の DM で聞いてください

---

</details>

<details>
<summary><b>更新手順</b></summary>

新規インストール手順で上書きしてもよいですが、使用ライブラリの更新などがない場合はプラグインだけの更新でも問題ありません。

1. [releases](https://github.com/eai04191/laoplus/releases) から最新の `LAOPLUS_x.x.x_PluginOnly.zip` をダウンロードする
2. zip に含まれている`net.laoplus.LAOPLUS.dll`を`LastOriginインストール先\BepInEx\plugins\net.laoplus.LAOPLUS.dll` に上書きする

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
