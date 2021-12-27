const cn = classNames;

export const FeatureSection: React.VFC<{
    children: React.ReactNode;
    hasError: boolean;
}> = ({ children, hasError }) => {
    return (
        <details
            className={cn(
                "pl-10 rounded shadow border",
                hasError
                    ? "border-red-600 shadow-red-300/50"
                    : "border-b-transparent"
            )}
        >
            {children}
        </details>
    );
};
