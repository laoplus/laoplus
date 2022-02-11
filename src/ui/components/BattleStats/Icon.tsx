import { Resource, Module } from "./type";

export const Icon: React.VFC<{ type: Resource | Module }> = ({ type }) => {
    const url = (() => {
        const base = `https://cdn.laoplus.net/ui/`;
        switch (type) {
            case "metal":
                return base + "/currenncy/metal.png";
            case "nutrient":
                return base + "/currenncy/nutrient.png";
            case "power":
                return base + "/currenncy/power.png";

            case "basic_module":
                return base + "/item/module/basic.png";
            case "advanced_module":
                return base + "/item/module/advanced.png";
            case "special_module":
                return base + "/item/module/special.png";
        }
    })();

    return <img className="w-full h-full object-contain" src={url} />;
};
