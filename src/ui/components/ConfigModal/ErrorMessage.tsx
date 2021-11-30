const cn = classNames;

export const ErrorMessage: React.VFC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => {
    return (
        <span className={cn("text-red-600 text-xs", className)}>
            {children}
        </span>
    );
};
