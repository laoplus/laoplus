/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export const resetLoginInfo = () => {
    const ok = confirm("ログイン情報を削除します。よろしいですか？");
    if (!ok) return;

    try {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/dexie/dist/dexie.js";
        script.onload = async () => {
            // @ts-ignore
            const db = new Dexie("/idbfs");
            await db.open();

            const key = (await db.table("FILE_DATA").toCollection().keys())
                // @ts-ignore
                .find((key) =>
                    key.includes(
                        "E5C006E672BA1D17C9DEF34BC18AB8C147F0AF238DE7B480B6B51C7CC9E3FCD8"
                    )
                );
            await db.table("FILE_DATA").delete(key);
            alert("ログイン情報を削除しました。ページを再読み込みします。");
            document.location.reload();
        };
        document.body.appendChild(script);
    } catch (error) {
        alert("ログイン情報の削除に失敗しました。");
    }
};
