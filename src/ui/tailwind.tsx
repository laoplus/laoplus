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
