const cn = classNames;

/**
 * ラスオリのボタンっぽいボタン
 * variantのプレビュー: https://user-images.githubusercontent.com/3516343/143912908-65956c55-b60d-4028-82d2-143b08414384.png
 */
export const SubmitButton: React.VFC<{
    children: React.ReactNode;
    variant?: 1 | 2;
    className?: string;
}> = ({ children, variant = 1, className }) => {
    const clipStyle = (() => {
        switch (variant) {
            default:
            case 1:
                return {
                    "--corner-size": "14px",
                    clipPath: `polygon(
                            calc(100% - var(--corner-size)) 0%,
                            100% var(--corner-size),
                            100% 100%,
                            var(--corner-size) 100%,
                            0% calc(100% - var(--corner-size)),
                            0 0
                        )`,
                } as React.CSSProperties;
            case 2:
                return {
                    "--gap-length": "8px",
                    "--outer": "calc(100% - calc(var(--gap-length) * 3))",
                    "--inner": "calc(100% - calc(var(--gap-length) * 2))",
                    "--inner2": "calc(100% - var(--gap-length))",
                    clipPath: `polygon(
                        0 0,
                        100% 0,

                        100% var(--outer),
                        var(--outer) 100%,

                        var(--inner) 100%,
                        100% var(--inner),

                        100% var(--inner2),
                        var(--inner2) 100%,

                        100% 100%,
                        0 100%
                    )`,
                } as React.CSSProperties;
        }
    })();

    return (
        <div className="drop-shadow">
            <button
                type="submit"
                className={cn(
                    "bg-amber-300 min-w-[6rem] p-3 font-bold leading-none",
                    { rounded: variant === 1 },
                    className
                )}
                style={clipStyle}
            >
                {children}
            </button>
        </div>
    );
};
