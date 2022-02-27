import { UseFormRegisterReturn } from "react-hook-form";
import { HelpIcon } from "./HelpIcon";

export const FeatureSectionSummary: React.VFC<{
    register?: UseFormRegisterReturn;
    title: string;
    helpLink?: string;
}> = ({ register, title, helpLink }) => {
    return (
        <summary className="relative flex cursor-pointer select-none justify-between py-4 pr-4">
            <h2 className="inline-flex items-center gap-2">
                {title}
                {helpLink && <HelpIcon href={helpLink} />}
            </h2>

            <div className="details-chevron flex items-center">
                <i className="bi bi-chevron-down"></i>
            </div>
            <label className="absolute left-0 top-0 -ml-10 flex h-full w-10 cursor-pointer items-center justify-center">
                {register && (
                    <input
                        type="checkbox"
                        className="h-4 w-4 before:cursor-pointer"
                        {...register}
                    />
                )}
            </label>
        </summary>
    );
};
