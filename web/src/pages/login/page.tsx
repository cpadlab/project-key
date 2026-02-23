import { ToggleThemeSelector } from "@/components/blocks/toggle-theme-selector"
import { VaultSelector } from "@/components/blocks/vault-selector"
import { VersionBadge } from "@/components/blocks/version-badge"
import { UnlockVault } from "./forms/unlock"

const LoginPage = () => {
    return (
        <main className="h-dvh p-8 bg-background flex items-center justify-center relative">

            <div className="pointer-events-none bg-linear-to-t dark:from-orange-500/50 from-orange-300/50 to-transparent h-[50vh] w-full absolute bottom-0" />

            <div className="flex flex-col items-center">
                <p className="text-center text-3xl font-bold mb-2">Unlock Vault</p>
                <p className="mb-4 text-center md:max-w-1/2 md:min-w-sm">Enter your master password and optionally select a key file to access your local database.</p>
                <UnlockVault />
            </div>

            <VaultSelector />
            <VersionBadge />
            <ToggleThemeSelector />

        </main>
    )
}

export default LoginPage