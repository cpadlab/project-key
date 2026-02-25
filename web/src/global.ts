import type { LucideIcon } from "lucide-react";

export interface GroupModel {
    name: string;
    icon: number | null;
    color: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface FooterItem {
    icon: LucideIcon;
    label: string;
    href: string;
    className?: string;
}

export interface FooterGroup {
    items: FooterItem[];
}

export interface GroupContextType {
    activeGroup: string;
    setActiveGroup: (name: string) => void;
    entries: any[];
    isLoading: boolean;
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
                is_session_active: () => Promise<boolean>;
                get_close_behavior: () => Promise<string>;
                get_security_settings: () => Promise<{
                    pwned_audit_enabled: boolean;
                    password_audit_interval: number;
                    clipboard_clear_interval: number;
                }>;
                set_pwned_audit_enabled: (enabled: boolean) => Promise<boolean>;
                set_password_audit_interval: (interval: number) => Promise<boolean>;
                set_clipboard_clear_interval: (interval: number) => Promise<boolean>;
                get_maintenance_settings: () => Promise<{
                    recycle_bin_retention_days: number;
                    backup_max_count: number;
                    other_services_interval: number;
                }>;
                set_recycle_bin_retention_days: (days: number) => Promise<boolean>;
                set_backup_max_count: (count: number) => Promise<boolean>;
                set_other_services_interval: (interval: number) => Promise<boolean>;
                get_log_level: () => Promise<string>;
                set_log_level: (level: string) => Promise<boolean>;
                open_log_dir: () => Promise<boolean>;
                open_backup_dir: () => Promise<boolean>;
                open_history_dir: () => Promise<boolean>;
                open_config_dir: () => Promise<boolean>;
                add_entry: (entry: any) => Promise<boolean>;
                export_data: (format: string, groupName?: string) => Promise<boolean>;
                get_csv_columns: (filePath: string) => Promise<string[]>;
                preview_csv_import: (filePath: string, preset?: string, mapping?: any) => Promise<any[]>;
                run_import: (entries: any[], targetGroup: string) => Promise<{ success: number; failed: number }>;
                search_entries: (query: string) => Promise<any[]>;
                update_group: (oldName: string, newName: string, icon: number, color?: string) => Promise<boolean>; // <--- Nuevo
            }
        }
    }
}

export {}