const cn = classNames;

export const ErrorMessage: React.VFC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => {
    return (
        <span className={cn("text-sm text-red-600", className)}>
            {children}
        </span>
    );
};
