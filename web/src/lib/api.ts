import type { GroupModel } from "@/global"


const getPywebviewApi = (): Promise<any> => {
    
    if (
        window.pywebview && 
        window.pywebview.api && 
        Object.keys(window.pywebview.api).length > 0
    ) {
        return Promise.resolve(window.pywebview.api)
    }

    return new Promise((resolve) => {
        window.addEventListener('pywebviewready', () => {
            resolve(window.pywebview.api)
        }, { once: true })
    })

}


export const backendAPI = {
    
    getAppName: async (): Promise<string> => {
        const api = await getPywebviewApi()
        return await api.get_app_name()
    },
    
    getAppVersion: async (): Promise<string> => {
        const api = await getPywebviewApi()
        return await api.get_app_version()
    },

    getHistory: async (): Promise<{raw: string, display: string}[]> => {
        const api = await getPywebviewApi()
        return await api.get_history()
    },

    clearHistory: async (): Promise<boolean> => {
        const api = await getPywebviewApi()
        return await api.clear_history()
    },

    selectSaveLocation: async (filename: string, ext: string): Promise<string | null> => {
        const api = await getPywebviewApi()
        return await api.save_file_dialog(filename, ext)
    },
    
    createNewVault: async (path: string, password: string, keyfile: string | null = null): Promise<boolean> => {
        const api = await getPywebviewApi()
        return await api.create_vault(path, password, keyfile)
    },
    
    generateKeyfile: async (path: string): Promise<string | null> => {
        const api = await getPywebviewApi()
        return await api.generate_keyfile(path)
    },

    getStartupRoute: async (): Promise<string> => {
        const api = await getPywebviewApi()
        return await api.get_startup_route()
    },

    setFilePath: async (path: string): Promise<boolean> => {
        const api = await getPywebviewApi();
        return await api.set_file_path(path);
    },

    selectFile: async (fileTypes: string[] = ['All files (*.*)']): Promise<string | null> => {
        const api = await getPywebviewApi()
        return await api.select_file(fileTypes)
    },

    selectVaultFile: async (): Promise<string | null> => {
        const api = await getPywebviewApi()
        return await api.select_file(['KeePass Database (*.kdbx)', 'All files (*.*)'])
    },

    selectKeyFile: async (): Promise<string | null> => {
        const api = await getPywebviewApi()
        return await api.select_file(['Key Files (*.key;*.keyx)', 'All files (*.*)'])
    },
    
    unlockVault: async (password: string, keyfile: string | null = null): Promise<boolean> => {
        const api = await getPywebviewApi()
        const parsedKeyfile = keyfile && keyfile.trim() !== "" ? keyfile : null;
        return await api.open_vault(password, parsedKeyfile)
    },

    createGroup: async (name: string, icon: number = 48, color?: string): Promise<boolean> => {
        const api = await getPywebviewApi();
        return await api.create_group(name, icon, color);
    },

    listGroups: async (): Promise<GroupModel[]> => {
        const api = await getPywebviewApi();
        return await api.list_groups();
    },

    deleteGroup: async (name: string, force: boolean = false, moveTo: string | null = null): Promise<boolean> => {
        const api = await getPywebviewApi();
        return await api.delete_group(name, force, moveTo);
    },
    
    setCloseBehavior: async (behavior: 'ask' | 'minimize' | 'exit'): Promise<boolean> => {
        const api = await getPywebviewApi();
        return await api.set_close_behavior(behavior);
    },

    minimizeWindow: async (): Promise<void> => {
        const api = await getPywebviewApi();
        return await api.minimize_window();
    },

    exitApplication: async (): Promise<void> => {
        const api = await getPywebviewApi();
        return await api.exit_application();
    },

}