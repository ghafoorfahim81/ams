import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import "./i18n";
import useLocale from "./hooks/use-locale";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";


createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        const AppWrapper = () => {
            const { isLoading } = useLocale();

            if (isLoading) {
                return;
            }

            return (
                <>
                    <App {...props} />
                </>
            );
        };

        root.render(<AppWrapper />);
    },
    progress: {
        color: "#4B5563",
    },
});
