const cn = classNames;

export const FeatureSection: React.VFC<{
    children: React.ReactNode;
    hasError: boolean;
}> = ({ children, hasError }) => {
    return (
        <details
            className={cn(
                "rounded border pl-10 shadow",
                hasError
                    ? "border-red-600 shadow-red-300/50"
                    : "border-b-transparent"
            )}
        >
            {children}
        </details>
    );
};
