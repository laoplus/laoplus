const cn = classNames;

/**
 * @package
 */
export const Spinner: React.VFC<{
    className?: string;
    style?: React.CSSProperties;
}> = ({ className, style }) => {
    return (
        <i className={cn("bi bi-arrow-repeat", className)} style={style}></i>
    );
};
