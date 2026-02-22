
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

}