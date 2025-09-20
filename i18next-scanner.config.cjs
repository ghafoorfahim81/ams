module.exports = {
    input: ["resources/js/**/*.{js,jsx,ts,tsx}", "!resources/js/locales/**"],
    output: "./resources/js/locales/",
    options: {
        debug: true,
        removeUnusedKeys: true,
        sort: true,
        func: {
            list: ["t", "trans", "i18next.t", "i18n.t"],
            extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
        lngs: ["en", "fa", "ps"],
        defaultLng: "en",
        resource: {
            loadPath: "{{lng}}/translation.json",
            savePath: "{{lng}}/translation.json",
        },
    },
};
