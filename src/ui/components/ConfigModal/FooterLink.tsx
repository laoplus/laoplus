export const FooterLink: React.VFC<{
    href: string;
    children: React.ReactNode;
}> = ({ href, children }) => {
    return (
        <a
            href={href}
            className="flex items-center gap-1"
            target="_blank"
            rel="noopener"
        >
            {children}
        </a>
    );
};
