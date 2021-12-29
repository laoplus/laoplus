export const FooterLink: React.VFC<{
    href: string;
    children: React.ReactNode;
}> = ({ href, children }) => {
    return (
        <a
            href={href}
            className="gap-1 flex items-center"
            target="_blank"
            rel="noopener"
        >
            {children}
        </a>
    );
};
