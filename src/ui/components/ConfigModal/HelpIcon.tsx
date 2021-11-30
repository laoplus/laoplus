export const HelpIcon: React.VFC<{ href: string }> = ({ href }) => {
    return (
        <span>
            <a href={href} target="_blank" rel="noreferrer" title="ヘルプ">
                <i className="bi bi-question-circle"></i>
            </a>
        </span>
    );
};
