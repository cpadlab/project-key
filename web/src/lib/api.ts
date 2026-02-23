
const getPywebviewApi = (): Promise<any> => {
    
    if (window.pywebview && window.pywebview.api) {
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

    selectVaultFile: async (): Promise<string | null> => {
        const api = await getPywebviewApi()
        return await api.select_vault_file()
    },

}