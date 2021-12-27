import { UseFormRegisterReturn } from "react-hook-form";
import { HelpIcon } from "./HelpIcon";

export const FeatureSectionSummary: React.VFC<{
    register: UseFormRegisterReturn;
    title: string;
    helpLink?: string;
}> = ({ register, title, helpLink }) => {
    return (
        <summary className="relative flex justify-between pr-4 py-4 cursor-pointer select-none">
            <h2 className="inline-flex gap-2 items-center">
                {title}
                {helpLink && <HelpIcon href={helpLink} />}
            </h2>

            <div className="details-chevron flex items-center transition-transform">
                <i className="bi bi-chevron-left"></i>
            </div>
            <label className="absolute left-0 top-0 flex items-center justify-center -ml-10 w-10 h-full cursor-pointer">
                <input
                    type="checkbox"
                    className="w-4 h-4 before:cursor-pointer"
                    {...register}
                />
            </label>
        </summary>
    );
};
