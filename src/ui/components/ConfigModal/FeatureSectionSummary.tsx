import { UseFormRegisterReturn } from "react-hook-form";
import { HelpIcon } from "./HelpIcon";

export const FeatureSectionSummary: React.VFC<{
    register: UseFormRegisterReturn;
    title: string;
    helpLink?: string;
}> = ({ register, title, helpLink }) => {
    return (
        <summary className="relative flex justify-between pr-4 py-4 cursor-pointer select-none">
            <h2 className="inline-flex gap-2">
                {title}
                {helpLink && <HelpIcon href={helpLink} />}
            </h2>

            <div className="details-chevron transition-transform">
                <i className="bi bi-chevron-left"></i>
            </div>
            <div className="absolute left-0 top-0 flex items-center justify-center -ml-10 w-10 h-full">
                <input
                    type="checkbox"
                    id="laoplus-discord-notification"
                    className="after:content-[''] after:absolute after:inset-0 w-4 h-4 after:cursor-pointer"
                    {...register}
                />
            </div>
        </summary>
    );
};
