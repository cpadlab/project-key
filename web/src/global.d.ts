
declare global {
    interface Window {
        pywebview: {
            api: {
                get_app_version: () => Promise<string>;
                get_app_name: () => Promise<string>;
                get_history: () => Promise<{raw: string, display: string}[]>;
                clear_history: () => Promise<boolean>;
                save_file_dialog: (filename: string, ext:string) => Promise<string | null>;
                create_vault: (path: string, password: string, keyfile: string | null) => Promise<boolean>;
                generate_keyfile: (path: string) => Promise<string | null>;
                get_startup_route: () => Promise<string>;
                set_file_path: (path: string) => Promise<boolean>;
                select_file: (file_types: string[]) => Promise<string | null>;
            }
        }
    }
}

export {}