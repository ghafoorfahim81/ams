import { clsx } from "clsx";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function trans(...args) {
    const { t } = useTranslation();
    return t(...args);
}
export function locale() {
    const { i18n } = useTranslation();
    return i18n.language;
}

export function formatNumber($value) {
    return new Intl.NumberFormat().format($value);
}

export function toTitleCase($value) {
    return $value;
}

export function translatePermission(permission) {
    const [action, ...resourceParts] = permission.split("_");
    const resourceKey = resourceParts.join("_");

    const resourceName = trans(
        `permission:resources.${resourceKey}`,
        resourceKey
    );
    return trans(`permission:actions.${action}`, { resource: resourceName });
}
