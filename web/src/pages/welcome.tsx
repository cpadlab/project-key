import { Button } from "@/components/ui/button"
import { FolderOpenIcon, PlusIcon } from "lucide-react"

import { ToggleThemeSelector } from "@/components/blocks/toggle-theme-selector"
import { VaultSelector } from "@/components/blocks/vault-selector"
import { VersionBadge } from "@/components/blocks/version-badge"
import { CreateNewVaultDialog } from "@/components/blocks/forms/create-new-vault"
import { useVaultSelection } from "@/hooks/use-vault-selection";

const WelcomePage = () => {

    const { openFileSelector } = useVaultSelection();

    return (
        <main className="h-dvh p-8 bg-background flex items-center justify-center relative">

            <div className="pointer-events-none bg-linear-to-t dark:from-orange-500/50 from-orange-300/50 to-transparent h-[50vh] w-full absolute bottom-0" />

            <div className="flex flex-col items-center">
                <p className="text-center text-3xl font-bold mb-2">Welcome to Project Key</p>
                <p className="mb-4 text-center md:max-w-1/2">Your ultimate offline password vault. Select an existing database or create a new secure environment to get started.</p>
                <div className="flex items-center gap-2 justify-center">
                    <Button onClick={openFileSelector}>
                        <span>Open Vault</span>
                        <FolderOpenIcon />
                    </Button>
                    <CreateNewVaultDialog>
                        <Button variant="secondary">
                            Create New Vault
                            <PlusIcon />
                        </Button>
                    </CreateNewVaultDialog>
                </div>
            </div>

            <VaultSelector />
            <VersionBadge />
            <ToggleThemeSelector />

        </main>
    )
}

export default WelcomePage