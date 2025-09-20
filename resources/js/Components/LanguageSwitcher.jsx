import { cn, trans } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import useLocale from "@/hooks/use-locale";

function LanguageSwitcher() {
    const { currentLanguage, changeLanguage } = useLocale();

    return (
        <div className="flex mx-auto gap-x-4">
            <Select
                value={currentLanguage}
                onValueChange={(value) => changeLanguage(value)}
                className="w-32"
            >
                <SelectTrigger className="w-[120px] rounded-full">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {[
                        { code: "fa", label: trans("Farsi") },
                        { code: "ps", label: trans("Pashto") },
                        { code: "en", label: trans("English") },
                    ].map((language) => (
                        <SelectItem
                            key={language.code}
                            value={language.code}
                            className={cn(
                                "rtl:flex-row-reverse rtl:text-right",
                                currentLanguage === language.code &&
                                    "cursor-not-allowed"
                            )}
                        >
                            {language.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

export default LanguageSwitcher;
