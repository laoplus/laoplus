import pluginUserscript from "rollup-plugin-userscript";
import pluginTypescript from "@rollup/plugin-typescript";
import pluginNodeResolve from "@rollup/plugin-node-resolve";
import pluginPostcss from "rollup-plugin-postcss";
import pluginJson from "@rollup/plugin-json";
import pkg from "./package.json";

export default {
    input: "./src/index.ts",
    output: [
        {
            name: `${pkg.name}.user`,
            file: __dirname + `/dist/${pkg.name}.user.js`,
            format: "iife",
        },
    ],
    plugins: [
        pluginJson(),
        pluginPostcss(),
        pluginUserscript(__dirname + "/src/banner.js", (meta) =>
            meta
                .replace("process.env.NAME", pkg.name.toUpperCase())
                .replace("process.env.VERSION", pkg.version)
                .replace("process.env.AUTHOR", pkg.author)
        ),
        pluginTypescript(),
        pluginNodeResolve({
            browser: true,
        }),
    ],
};
