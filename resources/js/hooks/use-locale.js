import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { router } from "@inertiajs/react";

const LOCAL_STORAGE_KEY = "app_locale";

const useLocale = () => {
    const { i18n } = useTranslation();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedLocale = localStorage.getItem(LOCAL_STORAGE_KEY);

        if (storedLocale) {
            i18n.changeLanguage(storedLocale);
            syncBackendLocale(storedLocale);
            setIsLoading(false);
        } else {
            fetchLocale();
        }
    }, []);

    const syncBackendLocale = async (locale) => {
        try {
            await axios.post(route("language.switch"), { locale });
        } catch (error) {
            console.error("Failed to sync backend locale", error);
        }
    };

    const fetchLocale = async () => {
        try {
            const response = await axios.get(route("language.get"));
            const locale = response.data.locale;
            i18n.changeLanguage(locale);
            localStorage.setItem(LOCAL_STORAGE_KEY, locale);
        } catch (error) {
            toast({
                variant: "destructive",
                title: i18n.t("Failed to fetch locale"),
            });
        } finally {
            setIsLoading(false);
        }
    };

    const changeLanguage = async (locale) => {
        i18n.changeLanguage(locale);
        localStorage.setItem(LOCAL_STORAGE_KEY, locale);

        try {
            await axios.post(route("language.switch"), { locale });
            window.location.reload();
            toast({ title: i18n.t("Language changed") });
        } catch (error) {
            toast({
                variant: "destructive",
                title: i18n.t("Something went wrong"),
            });
        }
    };

    return {
        currentLanguage: i18n.language,
        changeLanguage,
        isLoading,
    };
};

export default useLocale;
