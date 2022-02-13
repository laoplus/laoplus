/* eslint-disable no-undef */
/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */

// このファイルはtailwindcssの拡張機能で補完を使うためのダミー
// 実際には src/ui/tailwind.ts の config が読み込まれるため、いじる場合はそちらも編集すること

module.exports = {
    darkMode: "media",
    theme: {
        extend: {
            transitionProperty: {
                spacing: "margin, padding",
            },
            lineHeight: {
                zero: "0",
            },
            dropShadow: {
                featureIcon: "0 0 0.1em black",
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [require("@tailwindcss/forms")],
};
