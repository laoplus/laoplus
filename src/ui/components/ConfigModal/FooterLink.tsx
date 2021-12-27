export const FooterLink: React.VFC<{
    href: string;
    children: React.ReactNode;
}> = ({ href, children }) => {
    return (
        <a
            href={href}
            className="flex gap-1 items-center"
            target="_blank"
            rel="noopener"
        >
            {children}
        </a>
    );
};
