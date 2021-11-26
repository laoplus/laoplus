import pluginUserscript from "rollup-plugin-userscript";
import pluginTypescript from "@rollup/plugin-typescript";
import pluginNodeResolve from "@rollup/plugin-node-resolve";
import pkg from "./package.json";

export default {
    input: "./src/index.tsx",
    output: [
        {
            name: `${pkg.name}.user`,
            file: __dirname + `/dist/${pkg.name}.user.js`,
            format: "iife",
        },
    ],
    plugins: [
        pluginUserscript(__dirname + "/src/banner.js", (meta) =>
            meta
                .replace("process.env.VERSION", pkg.version)
                .replace("process.env.AUTHOR", pkg.author)
        ),
        pluginTypescript(),
        pluginNodeResolve({
            browser: true,
        }),
    ],
};
