
declare global {
    interface Window {
        pywebview: {
            api: {
                get_app_version: () => Promise<string>;
                get_app_name: () => Promise<string>;
            }
        }
    }
}

export {}