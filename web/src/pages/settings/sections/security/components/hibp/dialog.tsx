import { InfoIcon, ShieldCheckIcon, LockIcon, DatabaseIcon } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export const HIBPDialog = () => {
    return (
        <Dialog>
            
            <DialogTrigger asChild>
                <button className="text-muted-foreground hover:text-primary transition-colors focus:outline-none">
                    <InfoIcon className="h-4 w-4" />
                    <span className="sr-only">How does it work?</span>
                </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShieldCheckIcon className="h-5 w-5 text-primary" />
                        <span>How HIBP Audit Works</span>
                    </DialogTitle>
                    <DialogDescription>Your privacy is strictly protected. Your passwords never leave your device.</DialogDescription>
                </DialogHeader>
                        
                <div className="space-y-4 text-sm text-muted-foreground">
                    <p>When enabled, the app checks the <strong>Have I Been Pwned</strong> database to see if your passwords appear in known data breaches. It uses a secure privacy model called <em>k-Anonymity</em>:</p>
                    <ul className="space-y-3">
                        <li className="flex gap-3">
                            <LockIcon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <span><strong>Hashing:</strong> First, your password is converted into a cryptographic SHA-1 hash locally on your computer.</span>
                        </li>
                        <li className="flex gap-3">
                            <DatabaseIcon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <span><strong>Partial Request:</strong> Only the <em>first 5 characters</em> of that hash are sent to the HIBP servers.</span>
                        </li>
                        <li className="flex gap-3">
                            <ShieldCheckIcon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <span><strong>Local Verification:</strong> The server returns a list of breached hashes matching those 5 characters. Your app then checks locally if the full hash is in the list.</span>
                        </li>
                    </ul>
                    <p className="rounded-md bg-muted p-3 text-xs text-foreground mt-4">If a match is found, the entry will be automatically tagged as <code className="text-destructive font-bold">pwned</code> so you can change it.</p>
                </div>

            </DialogContent>
        
        </Dialog>
    )
}
