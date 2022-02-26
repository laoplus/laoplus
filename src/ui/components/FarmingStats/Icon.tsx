import { Resource, Module } from "./type";

/**
 * @package
 */
export const Icon: React.VFC<{ type: Resource | Module }> = ({ type }) => {
    const icon = (() => {
        const base = `https://cdn.laoplus.net/ui/`;
        switch (type) {
            case "parts":
                return { url: base + "/currenncy/metal.png", name: "部品" };
            case "nutrient":
                return { url: base + "/currenncy/nutrient.png", name: "栄養" };
            case "power":
                return { url: base + "/currenncy/power.png", name: "電力" };

            case "basic_module":
                return {
                    url: base + "/item/module/basic.png",
                    name: "一般モジュール",
                };
            case "advanced_module":
                return {
                    url: base + "/item/module/advanced.png",
                    name: "高級モジュール",
                };
            case "special_module":
                return {
                    url: base + "/item/module/special.png",
                    name: "特殊モジュール",
                };

            case "tuna":
                return { url: base + "/currenncy/tuna.png", name: "ツナ缶" };
        }
    })();

    return (
        <img
            className="h-full w-full object-contain"
            src={icon.url}
            title={icon.name}
        />
    );
};
