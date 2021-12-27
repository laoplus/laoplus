// tailwindcssの拡張機能で補完を使うために、このファイルを編集する際は tailwind.config.js も同じように編集すること

export const tailwindConfig: import("tailwindcss/tailwind-config").TailwindConfig =
    {
        darkMode: "media",
        theme: {
            extend: {
                transitionProperty: {
                    spacing: "margin, padding",
                },
                lineHeight: {
                    zero: "0",
                },
            },
        },
        variants: {
            extend: {},
        },
    };

/**
 * アプリ全体で使いたい大きめのセレクタに関しての設定
 */
export const initTailwindCustomStyle = () => {
    const style = document.createElement("style");
    style.setAttribute("type", "text/tailwindcss");
    style.innerText = `
    button[type='submit'], [type='checkbox'] {
        @apply hover:brightness-105;
    }
    /* フォーカス */
    [type='text']:focus, [type='email']:focus, [type='url']:focus, [type='password']:focus, [type='number']:focus, [type='date']:focus, [type='datetime-local']:focus, [type='month']:focus, [type='search']:focus, [type='tel']:focus, [type='time']:focus, [type='week']:focus, [multiple]:focus, [type='checkbox']:focus, textarea:focus, select:focus {
        @apply ring ring-offset-0 ring-amber-400/50
    }
    [type='text'] {
        @apply rounded leading-zero p-1 border-gray-400;
    }
    [type='checkbox'] {
        @apply rounded shadow-sm border-gray-400 text-amber-400;
    }
    /* checkedのsvgのfillをblackにする */
    [type='checkbox']:checked {
        background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='black' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
    }
    `;
    document.head.appendChild(style);
};
