import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslations from "./locales/en/translation.json";
import faTranslations from "./locales/fa/translation.json";
import psTranslations from "./locales/ps/translation.json";

import faAdmin from "./locales/fa/admin.json";
import enAdmin from "./locales/en/admin.json";
import psAdmin from "./locales/ps/admin.json";

import faReport from "./locales/fa/report.json";
import enReport from "./locales/en/report.json";
import psReport from "./locales/ps/report.json";

import faDoc from "./locales/fa/doc.json";
import enDoc from "./locales/en/doc.json";
import psDoc from "./locales/ps/doc.json";

import faApp from "./locales/fa/app.json";
import enApp from "./locales/en/app.json";
import psApp from "./locales/ps/app.json";

import faPermission from "./locales/fa/permission.json";
import enPermission from "./locales/en/permission.json";
import psPermission from "./locales/ps/permission.json";

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: enTranslations,
                admin: enAdmin,
                report: enReport,
                app: enApp,
                permission: enPermission,
                doc: enDoc
            },
            fa: {
                translation: faTranslations,
                admin: faAdmin,
                report: faReport,
                app: faApp,
                permission: faPermission,
                doc: faDoc

            },

            ps: {
                translation: psTranslations,
                admin: psAdmin,
                report: psReport,
                app: psApp,
                permission: psPermission,
                doc: psDoc

            },
        },
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
