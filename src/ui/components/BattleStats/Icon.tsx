type resource = "metal" | "nutrient" | "power" | "tuna";
type module = "basic_module" | "advanced_module" | "special_module";

export const Icon: React.VFC<{ type: resource | module }> = ({ type }) => {
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

    return <img className="inline w-4 h-4 object-contain" src={url} />;
};
