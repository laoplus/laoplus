# Contributing

## 必要なもの

-   git
-   .NET
-   Unity
-   などの知識

## LAOPLUS のビルド

1. LAOPLUS を clone する
2. ビルドする
    - Visual Studio を使う場合: LAOPLUS.sln を開き、ビルドする
    - dotnet cli を使う場合: LAOPLUS.sln があるディレクトリで `dotnet build` する

ゲームアセンブリの情報は[LastOrigin.GameLibs](https://nuget.bepinex.dev/packages/LastOrigin.GameLibs)から取得しています。これが古くなっている場合は更新が必要なのでこのリポジトリの issue でご連絡ください。

## Pull Request を送る

改善や新機能などの Pull Request は大歓迎です。

ただし、以下のルールを守ってください:

1. 適切な単位でコミット・PR する
    - 複数の事象に対して 1 つのコミットや PR で処理しないでください
1. PR のタイトルと説明を書く
    - 変更の意図が不明である場合は処理されません

また、PR する場合は情報共有のために[LAOPLUS Discord](https://discord.gg/EGWqTuhjrE)に参加することを強く推奨します。
