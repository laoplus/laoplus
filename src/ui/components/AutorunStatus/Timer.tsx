const cn = classNames;

/**
 * @package
 */
export const Timer: React.VFC<{
    targetDate: Date | null;
    className?: string;
}> = ({ targetDate, className }) => {
    // コンポーネントを毎秒更新する
    const [, setSeconds] = React.useState(0);
    React.useEffect(() => {
        const interval = window.setInterval(() => {
            setSeconds((seconds) => seconds + 1);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    if (targetDate !== null) {
        const duration = dayjs.duration(dayjs(targetDate).diff(dayjs()));
        return (
            <div className={cn("text-[10vh]", className)}>
                {duration.format("mm:ss")}
            </div>
        );
    }

    return <div className={cn("text-[6vh]", className)}>WAITING</div>;
};
