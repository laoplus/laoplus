export const HelpIcon: React.VFC<{ href: string }> = ({ href }) => {
    return (
        <a href={href} target="_blank" rel="noopener" title="ヘルプ">
            <i className="bi bi-question-circle"></i>
        </a>
    );
};
