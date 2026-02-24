export interface GroupModel {
    name: string;
    icon: number | null;
    color: string | null;
    created_at?: string;
    updated_at?: string;
}

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
                open_vault: (password: string, keyfile: string | null) => Promise<boolean>;
                create_group: (name: string, icon: number, color?: string) => Promise<boolean>;
                list_groups(): Promise<GroupModel[]>;
                set_close_behavior: (behavior: string) => Promise<boolean>;
                minimize_window: () => Promise<void>;
                exit_application: () => Promise<void>;
                close_session: () => Promise<boolean>;
            }
        }
    }
}

export {}