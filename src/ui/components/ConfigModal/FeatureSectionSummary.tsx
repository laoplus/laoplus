import { UseFormRegisterReturn } from "react-hook-form";
import { HelpIcon } from "./HelpIcon";

export const FeatureSectionSummary: React.VFC<{
    register: UseFormRegisterReturn;
    title: string;
    helpLink?: string;
}> = ({ register, title, helpLink }) => {
    return (
        <summary className="pr-4 py-4 cursor-pointer relative flex justify-between select-none">
            <h2 className="gap-2 inline-flex items-center">
                {title}
                {helpLink && <HelpIcon href={helpLink} />}
            </h2>

            <div className="details-chevron flex items-center">
                <i className="bi bi-chevron-down"></i>
            </div>
            <label className="-ml-10 w-10 h-full cursor-pointer absolute left-0 top-0 flex items-center justify-center">
                <input
                    type="checkbox"
                    className="w-4 h-4 before:cursor-pointer"
                    {...register}
                />
            </label>
        </summary>
    );
};
