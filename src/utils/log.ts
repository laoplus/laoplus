export const log = (name: string, ...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.log(
        `%cLAOPLUS :: ${name}`,
        "padding-right:.6rem;padding-left:.6rem;background:gray;color:white;border-radius:.25rem",
        ...args
    );
};
